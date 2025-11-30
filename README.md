# Villa & Garden Maintenance - MERN Application

Complete MERN (MongoDB, Express, React, Node.js) application for managing villa and garden maintenance with owner and admin roles.

## Project Structure

```
project/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── requestController.js
│   │   └── scheduleController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── roles.js
│   ├── models/
│   │   ├── User.js
│   │   ├── ServiceRequest.js
│   │   ├── Schedule.js
│   │   ├── Invoice.js
│   │   ├── Staff.js
│   │   └── Notice.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── requests.js
│   │   ├── schedules.js
│   │   ├── invoices.js
│   │   ├── staff.js
│   │   └── notices.js
│   ├── seed/
│   │   └── seed.js
│   ├── utils/
│   ├── server.js
│   ├── package.json
│   ├── Dockerfile
│   ├── .env.example
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── api.js
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── PrivateRoute.jsx
│   │   │   └── RoleRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── OwnerDashboard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── Requests.jsx
│   │   │   ├── Schedules.jsx
│   │   │   ├── Invoices.jsx
│   │   │   ├── Staff.jsx
│   │   │   └── Notices.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── .env.example
│   └── README.md
│
└── README.md (this file)
```

## Features

### Authentication
- JWT-based authentication
- httpOnly cookies for security
- Fallback localStorage for compatibility
- Owner registration and login
- Admin login

### Roles
- **Owner**: Can create service requests, view invoices, pay bills
- **Admin**: Full access to users, requests, staff management

### Core Features
- Service request management (CRUD)
- Schedule management
- Invoice management with fake payment processing
- Staff management
- Notices and announcements
- Role-based access control
- Pagination for list endpoints

## Quick Start

### Prerequisites
- Node.js 14+
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your MongoDB URI and JWT secret
# MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/villa_maintenance
# JWT_SECRET=your_secret_key

# Seed database (creates admin and sample data)
npm run seed

# Start development server
npm run dev
```

Server runs on `http://localhost:5000`

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev
```

Frontend runs on `http://localhost:5173`

### 3. Access Application

- Login: http://localhost:5173/login
- Register: http://localhost:5173/register

**Test Credentials** (after seeding):
- Admin: `admin@local.test` / `Password123!`
- Owner 1: `owner1@local.test` / `Password123!`
- Owner 2: `owner2@local.test` / `Password123!`

## API Endpoints

### Authentication
```bash
# Register (owner only)
POST /api/auth/register
Body: { name, email, phone, password, apartmentNumber }

# Login
POST /api/auth/login
Body: { email, password }

# Logout
POST /api/auth/logout
```

### Service Requests
```bash
# Create request (owner)
POST /api/requests
Body: { type, details, images[] }

# Get all requests (admin)
GET /api/requests?page=1&limit=10

# Get my requests (owner)
GET /api/requests/my?page=1&limit=10

# Update request (admin)
PUT /api/requests/:id
Body: { status, assignedTo }

# Delete request
DELETE /api/requests/:id
```

### Invoices
```bash
# Create invoice (admin)
POST /api/invoices
Body: { ownerId, amount, dueDate }

# Get invoices
GET /api/invoices?page=1&limit=10

# Pay invoice (fake payment)
POST /api/invoices/:id/pay
```

### Staff (Admin only)
```bash
# Create staff
POST /api/staff
Body: { name, role, phone }

# Get staff
GET /api/staff?page=1&limit=10
```

### Schedules
```bash
# Create schedule (admin)
POST /api/schedules
Body: { date, serviceType, staffId, owners[], notes }

# Get schedules
GET /api/schedules?page=1&limit=10
```

### Notices
```bash
# Create notice (admin)
POST /api/notices
Body: { title, body, visibleTo }

# Get notices
GET /api/notices?page=1&limit=10
```

## Example cURL Commands

### Login and Get Token
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@local.test","password":"Password123!"}'
```

Response includes token and user data. Token is also stored in httpOnly cookie.

### Create Service Request
```bash
TOKEN="your_token_from_login"

curl -X POST http://localhost:5000/api/requests \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "type":"Plumbing",
    "details":"Leaking faucet in kitchen",
    "images":[]
  }'
```

### Get Requests
```bash
TOKEN="your_token_from_login"

curl -X GET "http://localhost:5000/api/requests?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

## Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/villa_maintenance
JWT_SECRET=your_super_secret_jwt_key_change_in_production
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend (.env)
```
VITE_BACKEND_URL=http://localhost:5000
```

## Authentication Details

### JWT with httpOnly Cookies

**Security Benefits:**
- httpOnly flag prevents JavaScript access (XSS protection)
- Secure flag ensures HTTPS in production
- SameSite=lax prevents CSRF attacks
- Token automatically sent with credentials

**Fallback localStorage:**
- Token also returned in JSON for client-side storage
- Used if httpOnly cookie unavailable
- Less secure but provides compatibility

**How it works:**
1. Login returns token in JSON response
2. Token stored in httpOnly cookie (automatic)
3. Fallback token stored in localStorage
4. Subsequent requests include token via Authorization header
5. API interceptor handles token from both sources

## Testing Payment Flow

The payment endpoints use fake transactions:

```bash
# Create an invoice first
curl -X POST http://localhost:5000/api/invoices \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "ownerId":"owner_user_id",
    "amount":5000,
    "dueDate":"2024-12-31"
  }'

# Process payment (generates fake txn ID)
curl -X POST "http://localhost:5000/api/invoices/{invoice_id}/pay" \
  -H "Authorization: Bearer $OWNER_TOKEN"
```

Response includes generated transaction ID like `TXN_1234567890`.

## Production Deployment

See `DEPLOYMENT.md` for detailed deployment instructions using:
- **Vercel** for frontend
- **Render** for backend

## Database Models

### User
```javascript
{
  name: String (required),
  email: String (required, unique),
  phone: String (required),
  passwordHash: String (required),
  role: 'owner' | 'admin',
  apartmentNumber: String,
  createdAt: Date
}
```

### ServiceRequest
```javascript
{
  ownerId: ObjectId (ref: User),
  type: String,
  details: String,
  images: [String],
  status: 'open' | 'assigned' | 'in-progress' | 'completed',
  assignedTo: ObjectId (ref: Staff),
  createdAt: Date,
  updatedAt: Date
}
```

### Invoice
```javascript
{
  ownerId: ObjectId (ref: User),
  amount: Number,
  dueDate: Date,
  paid: Boolean,
  paymentTxId: String,
  createdAt: Date
}
```

### Schedule
```javascript
{
  date: Date,
  serviceType: String,
  staffId: ObjectId (ref: Staff),
  owners: [ObjectId] (ref: User),
  notes: String,
  createdAt: Date
}
```

### Staff
```javascript
{
  name: String,
  role: String,
  phone: String,
  assignedTasks: [ObjectId] (ref: ServiceRequest),
  createdAt: Date
}
```

### Notice
```javascript
{
  title: String,
  body: String,
  visibleTo: 'all' | 'owners' | 'admin',
  createdAt: Date
}
```

## Pagination

All list endpoints support pagination:

```bash
GET /api/endpoint?page=1&limit=10
```

Response:
```json
{
  "items": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad request / validation error
- `401` - Unauthorized
- `403` - Forbidden (insufficient permissions)
- `404` - Not found
- `500` - Server error

Error response format:
```json
{
  "error": "Error message here"
}
```

## Development Tips

1. **Check backend logs** for detailed error messages
2. **Use browser DevTools** to inspect network requests
3. **Clear localStorage** if having auth issues: `localStorage.clear()`
4. **MongoDB Atlas** - Whitelist your IP for database access
5. **CORS issues** - Ensure CLIENT_URL matches frontend URL

## TODO Items

- [ ] Add rate limiting to API endpoints
- [ ] Implement actual Cloudinary integration for images
- [ ] Add real payment gateway (Stripe/Razorpay)
- [ ] Add email notifications
- [ ] Implement password reset flow
- [ ] Add file upload support
- [ ] Add user profile management
- [ ] Add activity logging
- [ ] Implement export to PDF for invoices

## License

MIT
