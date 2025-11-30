# Deployment Guide - Vercel & Render

Complete step-by-step guide for deploying Villa & Garden Maintenance to Vercel (frontend) and Render (backend).

## Table of Contents
1. [MongoDB Atlas Setup](#mongodb-atlas-setup)
2. [Backend Deployment (Render)](#backend-deployment-render)
3. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
4. [Post-Deployment Verification](#post-deployment-verification)

---

## MongoDB Atlas Setup

### 1. Create MongoDB Atlas Account
- Go to https://www.mongodb.com/cloud/atlas
- Sign up for a free account
- Click "Build a Cluster"

### 2. Create a Cluster
- Choose free tier M0 (adequate for development)
- Select a region close to your deployment
- Click "Create Cluster"

### 3. Create Database User
- Go to "Database Access" → "Add New Database User"
- Username: `appuser`
- Password: Generate secure password (save this!)
- Assign roles: `readWriteAnyDatabase`
- Click "Add User"

### 4. Whitelist IP Addresses
- Go to "Network Access" → "Add IP Address"
- Click "Add Current IP" (for local testing)
- For production: Click "Allow Access from Anywhere" (enter 0.0.0.0/0)
  - Note: Less secure but necessary for most cloud deployments
- Click "Confirm"

### 5. Get Connection String
- Go to "Databases" → "Connect"
- Click "Connect your application"
- Select "Node.js" and version 4.1+
- Copy the connection string

Replace `<password>` and `<cluster-name>`:
```
mongodb+srv://appuser:<password>@<cluster-name>.mongodb.net/villa_maintenance?retryWrites=true&w=majority
```

Save this as `MONGODB_URI` for later.

---

## Backend Deployment (Render)

### 1. Prepare Backend for Deployment

In `backend/server.js`, ensure it listens on all interfaces:
```javascript
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

Create `backend/render.yaml` (optional, for better configuration):
```yaml
services:
  - type: web
    name: villa-maintenance-backend
    env: node
    buildCommand: npm install
    startCommand: node server.js
    envVars:
      - key: NODE_ENV
        value: production
```

### 2. Push to GitHub

Initialize git repository and push code:
```bash
cd project-root
git init
git add .
git commit -m "Initial commit: Villa maintenance MERN app"
git remote add origin https://github.com/YOUR_USERNAME/villa-maintenance.git
git branch -M main
git push -u origin main
```

### 3. Deploy to Render

1. Go to https://render.com and sign up with GitHub
2. Click "New +" → "Web Service"
3. Select your `villa-maintenance` repository
4. Configure:
   - **Name**: `villa-maintenance-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Region**: Choose location closest to users

5. Click "Advanced" and add environment variables:
   ```
   MONGODB_URI = mongodb+srv://appuser:<password>@<cluster>.mongodb.net/villa_maintenance
   JWT_SECRET = <generate-random-secret-key>
   CLIENT_URL = https://villa-maintenance.vercel.app (set after frontend deployment)
   NODE_ENV = production
   ```

6. Click "Create Web Service"
7. Wait for deployment (logs show progress)
8. Once live, note your backend URL: `https://villa-maintenance-backend.onrender.com`

### 4. Seed Production Database

Once backend is deployed:

```bash
# SSH into Render instance or run via curl
curl -X POST https://villa-maintenance-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@local.test","password":"Password123!"}'
```

If seed script needs to run automatically, add to `backend/server.js`:

```javascript
// Run seed on first deployment (check for existing admin)
const seedOnFirstRun = async () => {
  const adminExists = await User.findOne({ role: 'admin' });
  if (!adminExists && process.env.NODE_ENV === 'production') {
    console.log('Running seed for first time...');
    require('./seed/seed');
  }
};

connectDB().then(() => {
  if (process.env.NODE_ENV === 'production') {
    seedOnFirstRun();
  }
});
```

---

## Frontend Deployment (Vercel)

### 1. Prepare Frontend for Deployment

Update `frontend/.env.production`:
```
VITE_BACKEND_URL=https://villa-maintenance-backend.onrender.com
```

Update `frontend/vite.config.js`:
```javascript
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
```

### 2. Deploy to Vercel

1. Go to https://vercel.com and sign up with GitHub
2. Click "New Project"
3. Select your `villa-maintenance` repository
4. Configure:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variables**:
     ```
     VITE_BACKEND_URL = https://villa-maintenance-backend.onrender.com
     ```

5. Click "Deploy"
6. Wait for deployment to complete
7. Your frontend URL: `https://villa-maintenance.vercel.app`

### 3. Update Backend with Frontend URL

Go back to Render dashboard:
1. Select `villa-maintenance-backend`
2. Go to "Environment" tab
3. Update `CLIENT_URL`:
   ```
   CLIENT_URL = https://villa-maintenance.vercel.app
   ```
4. Click "Save"
5. Service will auto-redeploy

---

## Post-Deployment Verification

### 1. Test Backend Health

```bash
curl https://villa-maintenance-backend.onrender.com/api/health
# Expected response: { "status": "Backend is running" }
```

### 2. Test Authentication

```bash
curl -X POST https://villa-maintenance-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"admin@local.test",
    "password":"Password123!"
  }'
```

Response should include token and user data.

### 3. Test Frontend Access

- Visit: https://villa-maintenance.vercel.app
- Click "Login"
- Use admin credentials: `admin@local.test` / `Password123!`
- Verify dashboard loads

### 4. Check Browser Console

Open DevTools (F12) → Console tab to check for errors:
- CORS errors → Update `CLIENT_URL` in backend
- 404 errors → Verify backend routes
- Auth errors → Check token storage

### 5. Test Key Features

- [ ] Login with admin account
- [ ] Create a service request
- [ ] View requests list
- [ ] View invoices
- [ ] Access admin-only pages
- [ ] Logout and login as owner

---

## Troubleshooting

### Backend Not Responding

**Problem**: `Connection refused` or timeout
- Check Render service is running: Render dashboard → Service logs
- Verify MongoDB connection: Check `MONGODB_URI` environment variable
- Check CORS: Ensure `CLIENT_URL` matches frontend URL

**Solution**:
```bash
# Check logs in Render dashboard
# Verify MongoDB whitelist: Atlas → Network Access → Check your IP
```

### Frontend Can't Connect to Backend

**Problem**: `CORS error` in browser console
- Backend `CLIENT_URL` doesn't match frontend URL

**Solution**:
```bash
# In Render dashboard, update CLIENT_URL to exact frontend URL
# For Vercel preview deployments, update for each preview
CLIENT_URL = https://villa-maintenance.vercel.app
```

### 401 Unauthorized After Login

**Problem**: Token not being sent with requests
- Check browser storage: DevTools → Application → Cookies/Storage
- Verify `withCredentials: true` in API client

**Solution**:
- Check `frontend/src/api/api.js` has `withCredentials: true`
- Clear browser storage: `localStorage.clear()` + refresh

### MongoDB Connection Errors

**Problem**: `MongoNetworkError` or `ECONNREFUSED`
- IP not whitelisted in MongoDB Atlas
- Connection string incorrect

**Solution**:
```bash
# 1. Verify connection string in Render environment
# 2. Go to MongoDB Atlas → Network Access
# 3. Add Render's IP or allow 0.0.0.0/0
# 4. Update MONGODB_URI if using wrong cluster
```

---

## Monitoring & Logs

### Render Backend Logs
- Dashboard → Select service → "Logs" tab
- Shows real-time server activity and errors
- Download logs for analysis

### Vercel Frontend Logs
- Dashboard → Select deployment → "Logs" tab
- Shows build output and runtime errors
- Check Function logs for API issues

### MongoDB Atlas Monitoring
- Dashboard → Monitoring tab
- Check connection metrics
- View slow queries

---

## Environment Variables Summary

### Backend (Render)
```
MONGODB_URI=mongodb+srv://appuser:PASSWORD@cluster.mongodb.net/villa_maintenance
JWT_SECRET=your_random_secret_key_min_32_chars
CLIENT_URL=https://villa-maintenance.vercel.app
NODE_ENV=production
PORT=not needed (Render assigns automatically)
```

### Frontend (Vercel)
```
VITE_BACKEND_URL=https://villa-maintenance-backend.onrender.com
```

---

## Cost Considerations

### Render (Backend)
- Free tier: Web service auto-sleeps after 15 min inactivity
- Starter plan: $7/month - always active
- Database service: $15/month (optional)

### Vercel (Frontend)
- Free: Unlimited static site deployments
- Function: Pay per execution (most projects free tier sufficient)

### MongoDB Atlas
- Free tier M0: 512MB storage (adequate for small projects)
- M2: $9/month - 2GB storage
- M5: $57/month and up

---

## Next Steps

1. **Custom Domain**: 
   - Vercel: Add domain in project settings
   - Render: Add custom domain and CNAME records

2. **SSL/HTTPS**:
   - Vercel: Automatic
   - Render: Automatic

3. **CI/CD Improvements**:
   - Auto-deploy on git push (both platforms)
   - Run tests before deployment
   - Database backups

4. **Performance**:
   - Enable caching on Vercel
   - Use CDN for static assets
   - Optimize MongoDB indexes

5. **Monitoring**:
   - Set up error tracking (Sentry)
   - Monitor uptime
   - Alert on failures

---

## Quick Deploy Commands

```bash
# 1. Push to GitHub
git add .
git commit -m "Deployment ready"
git push origin main

# 2. Render auto-deploys from GitHub
# 3. Vercel auto-deploys from GitHub
# 4. Test at: https://villa-maintenance.vercel.app

# Local testing after deployment
curl https://villa-maintenance-backend.onrender.com/api/health
curl https://villa-maintenance.vercel.app
```

---

## Support

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com
- **GitHub Actions**: For advanced CI/CD pipelines

Happy deploying! 🚀
