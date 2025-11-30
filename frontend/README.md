# Villa & Garden Maintenance - Frontend

React + Vite frontend for the MERN villa maintenance application.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   - Copy `.env.example` to `.env`
   - Update `VITE_BACKEND_URL` if backend is not on http://localhost:5000

3. **Run development server:**
   ```bash
   npm run dev
   ```
   Frontend will run on http://localhost:5173

4. **Build for production:**
   ```bash
   npm run build
   ```

## Environment Variables

- `VITE_BACKEND_URL`: Backend API URL (default: http://localhost:5000)

## Features

- JWT authentication with httpOnly cookie support
- Role-based access control (owner/admin)
- Service request management
- Schedule viewing
- Invoice management with fake payment flow
- Staff management (admin)
- Notices
- Responsive design with simple CSS

## Authentication

- Tokens are stored in httpOnly cookies for security
- Fallback token stored in localStorage for compatibility
- Automatic token refresh on 401 errors
- Credentials included in API calls

## Pages

- **Login** - Owner and admin login
- **Register** - Owner registration
- **Dashboard** - Role-based dashboard
- **Requests** - Service request CRUD
- **Schedules** - View maintenance schedules
- **Invoices** - View and pay invoices
- **Staff** - Manage staff (admin only)
- **Notices** - View notifications

## Example Credentials

After seeding backend:
- Admin: admin@local.test / Password123!
- Owner: owner1@local.test / Password123!

## Deployment

See [DEPLOYMENT.md](../DEPLOYMENT.md) for Vercel and Render deployment instructions.
