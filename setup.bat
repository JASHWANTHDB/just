@echo off
REM Villa & Garden Maintenance - Quick Start Script for Windows

echo.
echo ====================================
echo Villa ^& Garden Maintenance Setup
echo ====================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo X Node.js is not installed. Please install Node.js 14+ first.
    echo   Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js installed: 
node --version

REM Setup Backend
echo.
echo Setting up Backend...
cd backend

if not exist .env (
    echo Creating .env from .env.example...
    copy .env.example .env
    echo.
    echo WARNING: Please update backend\.env with your MongoDB URI and JWT secret
    echo   Edit: backend\.env
    pause
)

echo Installing backend dependencies...
call npm install

echo.
echo Backend setup complete!
echo   Start backend: cd backend ^&^& npm run dev
echo   Seed database: cd backend ^&^& npm run seed

REM Setup Frontend
echo.
echo Setting up Frontend...
cd ..\frontend

if not exist .env (
    echo Creating .env from .env.example...
    copy .env.example .env
)

echo Installing frontend dependencies...
call npm install

echo.
echo Frontend setup complete!
echo   Start frontend: cd frontend ^&^& npm run dev

echo.
echo ====================================
echo Setup Complete!
echo ====================================
echo.
echo Next steps:
echo 1. Configure backend\.env with MongoDB URI
echo 2. Run database seed:
echo    cd backend ^&^& npm run seed
echo 3. Start backend:
echo    cd backend ^&^& npm run dev
echo 4. In another terminal, start frontend:
echo    cd frontend ^&^& npm run dev
echo.
echo Access app at: http://localhost:5173
echo Test credentials (after seeding):
echo   Admin: admin@local.test / Password123!
echo   Owner: owner1@local.test / Password123!
echo.
pause
