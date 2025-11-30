# Villa & Garden Maintenance - Backend

Node.js + Express + MongoDB backend for the MERN villa maintenance application.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   - Copy `.env.example` to `.env`
   - Update `MONGODB_URI` with your MongoDB Atlas connection string
   - Set a strong `JWT_SECRET`

3. **Seed database:**
   ```bash
   npm run seed
   ```
   This creates an admin user and two owner accounts with sample data.

4. **Run development server:**
   ```bash
   npm run dev
   ```
   Server will run on http://localhost:5000

## Environment Variables

- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret for JWT signing (change in production!)
- `PORT`: Server port (default: 5000)
- `CLIENT_URL`: Frontend URL for CORS
- `NODE_ENV`: development | production

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new owner
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout

### Users (Admin only)
- `GET /api/users` - List users
- `GET /api/users/:id` - Get user details
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Service Requests
- `POST /api/requests` - Create request (owner)
- `GET /api/requests` - Get all requests (admin)
- `GET /api/requests/my` - Get my requests (owner)
- `PUT /api/requests/:id` - Update request (admin)
- `DELETE /api/requests/:id` - Delete request

### Schedules
- `POST /api/schedules` - Create schedule (admin)
- `GET /api/schedules` - Get schedules

### Invoices
- `POST /api/invoices` - Create invoice (admin)
- `GET /api/invoices` - Get invoices
- `POST /api/invoices/:id/pay` - Process payment (fake)

### Staff (Admin only)
- `POST /api/staff` - Create staff
- `GET /api/staff` - Get staff list

### Notices
- `POST /api/notices` - Create notice (admin)
- `GET /api/notices` - Get notices

## Test Credentials

After seeding:
- **Admin**: admin@local.test / Password123!
- **Owner 1**: owner1@local.test / Password123!
- **Owner 2**: owner2@local.test / Password123!

## Authentication

JWT tokens are stored in httpOnly cookies for security. Fallback token is also returned in JSON response for localStorage option:

```javascript
// Cookie (httpOnly, secure in production)
// Header: Authorization: Bearer <token>
// or use token from localStorage
```

## Notes

- Tokens expire in 7 days
- Passwords are hashed with bcryptjs
- All sensitive routes require authentication
- Admin-only routes require `role: 'admin'`
