# Quick Start Guide

## Initial Setup

### Option 1: Automated Setup (Recommended)

**On Windows:**
```bash
setup.bat
```

**On macOS/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

### Option 2: Manual Setup

1. **Backend Setup**
```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI
npm install
npm run seed
npm run dev
```

2. **Frontend Setup** (in new terminal)
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Configuration

### MongoDB Atlas
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Create a database user
4. Whitelist your IP
5. Copy connection string to `backend/.env`

Example:
```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/villa_maintenance
```

### JWT Secret
Generate a secure random string for `backend/.env`:
```
JWT_SECRET=your-random-secret-key-here-min-32-chars
```

## Test Credentials

After running `npm run seed` in backend:

- **Admin**: admin@local.test / Password123!
- **Owner 1**: owner1@local.test / Password123!
- **Owner 2**: owner2@local.test / Password123!

## Running the Application

### Development

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Server: http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# App: http://localhost:5173
```

### Production

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
# Outputs to dist/ folder
```

## Deployment

See `DEPLOYMENT.md` for detailed instructions:
- Frontend deployment to Vercel
- Backend deployment to Render
- MongoDB Atlas configuration
- Environment variables setup

## Troubleshooting

### Port Already in Use
```bash
# Change port in backend/.env or frontend/vite.config.js
PORT=5001  # Backend
```

### MongoDB Connection Error
1. Check connection string in `backend/.env`
2. Verify IP whitelisting in MongoDB Atlas
3. Ensure database user exists

### CORS Errors
- Update `backend/.env` CLIENT_URL to match frontend URL
- Verify frontend is making requests to correct backend URL

### Clear Data
```bash
# Reseed database with sample data
cd backend
npm run seed
```

## Project Structure

```
project/
├── backend/          - Express + MongoDB API
│   ├── models/       - Mongoose schemas
│   ├── routes/       - API endpoints
│   ├── controllers/  - Business logic
│   ├── middleware/   - Auth & validation
│   └── seed/         - Sample data
│
├── frontend/         - React + Vite app
│   ├── src/pages/    - Page components
│   ├── src/api/      - API client
│   ├── src/context/  - Auth context
│   └── src/components/ - Reusable UI
│
├── README.md         - Full documentation
└── DEPLOYMENT.md     - Deployment guide
```

## Features Overview

### For Owners
- Create service requests
- View request status
- See maintenance schedules
- Pay invoices
- Read notices

### For Admins
- Manage users
- Assign service requests
- Create schedules
- Create invoices
- Manage staff
- Post notices

## Next Steps

1. **Set up development environment** (follow above)
2. **Explore the codebase** - start with `backend/server.js` and `frontend/src/App.jsx`
3. **Create sample data** - run `npm run seed` in backend
4. **Test features** - use provided test credentials
5. **Deploy** - follow `DEPLOYMENT.md`

## Support Resources

- Backend README: `backend/README.md`
- Frontend README: `frontend/README.md`
- Full Documentation: `README.md`
- Deployment Guide: `DEPLOYMENT.md`

---

For detailed API documentation and deployment instructions, see the main `README.md` and `DEPLOYMENT.md` files.
