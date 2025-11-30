# Multiple Owner Support Guide

## Overview
The Villa & Garden Maintenance system supports **unlimited owner accounts**. Each owner can independently register, login, and manage their own service requests, schedules, and invoices.

## How It Works

### 1. Registration (Multiple Owners)
Each owner registers independently with their own email address:

```
Owner 1: John Smith (john@example.com)
Owner 2: Sarah Johnson (sarah@example.com)
Owner 3: Mike Williams (mike@example.com)
```

**Key Requirements:**
- Email must be **unique** (one email = one account)
- All other fields can match (same phone, same apartment building, etc.)
- Password must be at least 6 characters
- Apartment number is optional but recommended for identification

### 2. Login
Each owner logs in with their own credentials:
```
John: Email: john@example.com | Password: SecurePass123
Sarah: Email: sarah@example.com | Password: SecurePass456
```

### 3. Data Isolation
**Each owner only sees their own data:**
- Service requests they submitted
- Their own invoices
- Their own schedules
- Their notifications

Sarah's service requests are **NOT visible** to John, even though they're in the same system.

### 4. Admin Access
The admin account can see **ALL** data:
```
Admin: admin@local.test / Password123!
```

Admin can:
- View all service requests from all owners
- View all invoices from all owners
- View all schedules across all owners
- Manage staff and system settings

---

## Testing Multiple Owners

### Step-by-Step Test

#### 1. Start the System
```bash
# Backend (terminal 1)
cd backend
npm run dev

# Frontend (terminal 2)
cd frontend
npm run dev
```

#### 2. Register Owner 1
- Navigate to: `http://localhost:5173/register`
- **Fill in:**
  - Name: `John Smith`
  - Email: `john@test.local`
  - Phone: `555-0101`
  - Apartment: `101`
  - Password: `TestPass123!`
- Click **Register**
- ✅ Should see Owner Dashboard

#### 3. Create Service Request (Owner 1)
- Click **"New Request"**
- Submit a service request (e.g., "Fix garden fence")
- ✅ Request appears in Owner 1's dashboard

#### 4. Logout
- Click **Logout** (top right)
- ✅ Redirected to Login page

#### 5. Register Owner 2
- Click **"Register"** link
- **Fill in:**
  - Name: `Sarah Johnson`
  - Email: `sarah@test.local`
  - Phone: `555-0102`
  - Apartment: `202`
  - Password: `TestPass456!`
- Click **Register**
- ✅ Should see empty Owner Dashboard (no requests yet)

#### 6. Create Service Request (Owner 2)
- Click **"New Request"**
- Submit a service request (e.g., "Pool cleaning needed")
- ✅ Request appears in Owner 2's dashboard
- ⚠️ **Owner 1's request is NOT visible here**

#### 7. Login as Owner 1 Again
- Click **Logout**
- Login with: `john@test.local` / `TestPass123!`
- ✅ See only your original request
- ✅ Sarah's request is NOT visible

#### 8. Login as Admin
- Click **Logout**
- Login with: `admin@local.test` / `Password123!`
- Click **Admin Dashboard**
- ✅ See **ALL** requests from both owners
- ✅ Can view all owners' data

---

## API Endpoints for Multiple Owners

### 1. Register New Owner
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Owner",
    "email": "newowner@example.com",
    "phone": "555-0103",
    "password": "SecurePass789!",
    "apartmentNumber": "303"
  }'
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGc...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "New Owner",
    "email": "newowner@example.com",
    "role": "owner",
    "apartmentNumber": "303"
  }
}
```

### 2. Login as Owner
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newowner@example.com",
    "password": "SecurePass789!"
  }'
```

### 3. Get My Requests (Owner Only Sees Their Own)
```bash
curl -X GET http://localhost:5000/api/requests/my \
  -H "Authorization: Bearer eyJhbGc..."
```

**Response:** Only requests created by this owner

### 4. Create Service Request
```bash
curl -X POST http://localhost:5000/api/requests \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Garden maintenance",
    "description": "Trim hedges and water plants",
    "priority": "high"
  }'
```

---

## Database Structure

### User Collection
```javascript
{
  _id: ObjectId,
  name: "John Smith",
  email: "john@test.local",           // ← UNIQUE constraint
  phone: "555-0101",
  passwordHash: "$2b$10$...",         // ← bcrypt hashed
  role: "owner",                      // ← Always "owner" for self-registration
  apartmentNumber: "101",
  createdAt: ISODate("2024-01-15T...")
}

{
  _id: ObjectId,
  name: "Sarah Johnson",
  email: "sarah@test.local",          // ← Different email
  phone: "555-0102",
  passwordHash: "$2b$10$...",
  role: "owner",
  apartmentNumber: "202",
  createdAt: ISODate("2024-01-15T...")
}
```

### Service Requests (Data Isolation)
```javascript
{
  _id: ObjectId,
  ownerId: ObjectId("...John's ID..."),  // ← Links to owner
  title: "Fix garden fence",
  description: "...",
  status: "pending",
  createdAt: ISODate("...")
}

{
  _id: ObjectId,
  ownerId: ObjectId("...Sarah's ID..."), // ← Different owner
  title: "Pool cleaning",
  description: "...",
  status: "pending",
  createdAt: ISODate("...")
}
```

When Sarah logs in, queries filter by **her** ownerId, so she only sees her requests.

---

## Error Handling

### Email Already Registered
**Scenario:** User tries to register with existing email

**Error Message:**
```
Email already registered. Please use a different email or login.
```

**Solution:** 
- Use a different email address, OR
- Click "Login" if you already have an account

### Duplicate Email Prevention
The system enforces unique emails at the database level:
- Backend: `User.findOne({ email })`
- Database: `unique: true` on email field
- Error returned: "User already exists"

### Login Failures
**Invalid Credentials:**
```
Login failed
```

**Solutions:**
- Verify email spelling
- Verify password is correct
- Check CAPS LOCK
- Ensure owner was registered first

---

## Security Features

### 1. Password Protection
- Passwords hashed with **bcryptjs** (salt rounds: 10)
- Passwords never stored in plaintext
- Passwords never logged or transmitted unencrypted

### 2. JWT Tokens
- Token expires after **7 days**
- Token stored in **httpOnly cookie** (XSS protection)
- Each login generates new token
- Token tied to specific userId

### 3. Data Isolation
- Query filters check `userId` matches token
- Owners cannot access other owners' data
- Admin can access all data (intentional)

### 4. CORS Configuration
- Only requests from `http://localhost:5173` accepted (dev)
- In production, update to actual frontend URL

---

## Production Deployment

### Before Going Live

1. **Update CORS**
   ```javascript
   // backend/server.js
   const corsOptions = {
     origin: "https://yourdomain.com",  // ← Change this
     credentials: true
   };
   ```

2. **Update MongoDB Connection**
   ```javascript
   // backend/.env
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/villa-db
   ```

3. **Update Frontend API Base URL**
   ```javascript
   // frontend/src/api/api.js
   const BASE_URL = "https://api.yourdomain.com";
   ```

4. **Generate Strong JWT Secret**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Use output as `JWT_SECRET` in backend `.env`

---

## Troubleshooting

### "User already exists" Error
**Cause:** Email already registered
**Fix:** Use different email or login with existing account

### Owner Sees Another Owner's Data
**This should NOT happen.** If it does:
1. Check userId in request (verify correct token)
2. Check server logs for query issues
3. Verify database structure (email uniqueness)

### Cannot Login After Registration
**Possible causes:**
1. Email/password mismatch during registration/login
2. Database connection issue
3. Backend not running

**Debug steps:**
1. Verify backend is running: `npm run dev` in backend folder
2. Check MongoDB connection in backend console
3. Verify `.env` file has `MONGODB_URI` and `JWT_SECRET`

---

## Example Multi-Owner Workflow

```
Day 1: Setup
├─ Register Admin: admin@local.test
├─ Register Owner 1: john@example.com (Apt 101)
└─ Register Owner 2: sarah@example.com (Apt 202)

Day 2: Usage
├─ John logs in
│  ├─ Views his 3 service requests
│  ├─ Creates new request
│  └─ Views his invoice
├─ Sarah logs in
│  ├─ Views her 2 service requests (different from John's)
│  ├─ Creates new request
│  └─ Views her invoice

Day 3: Admin Management
├─ Admin logs in
├─ Views all 5 requests (3 from John, 2 from Sarah)
├─ Assigns staff to requests
├─ Generates invoices for all owners
└─ Views system analytics
```

---

## Summary

✅ **Multiple owners can:**
- Register independently with unique emails
- Login with their own credentials
- Create and manage their own service requests
- View their own invoices and schedules
- Receive notifications for their requests

✅ **Admin can:**
- See all owner data
- Manage all service requests
- Generate invoices for all owners
- Manage staff and system

✅ **System ensures:**
- Email uniqueness (no duplicate accounts)
- Data isolation (owners can't see each other's data)
- Secure authentication (JWT + bcrypt)
- Session persistence (token stored securely)

**The system is production-ready for multiple owner accounts!** 🚀
