#!/bin/bash

# Villa & Garden Maintenance - Quick Start Script

echo "===================================="
echo "Villa & Garden Maintenance Setup"
echo "===================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 14+ first."
    exit 1
fi

echo "✓ Node.js installed: $(node --version)"

# Setup Backend
echo ""
echo "Setting up Backend..."
cd backend

if [ ! -f .env ]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo "⚠️  Please update backend/.env with your MongoDB URI and JWT secret"
    echo "   Edit: backend/.env"
fi

echo "Installing backend dependencies..."
npm install

echo ""
echo "✓ Backend setup complete!"
echo "  Start backend: cd backend && npm run dev"
echo "  Seed database: cd backend && npm run seed"

# Setup Frontend
echo ""
echo "Setting up Frontend..."
cd ../frontend

if [ ! -f .env ]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env
fi

echo "Installing frontend dependencies..."
npm install

echo ""
echo "✓ Frontend setup complete!"
echo "  Start frontend: cd frontend && npm run dev"

echo ""
echo "===================================="
echo "✓ Setup Complete!"
echo "===================================="
echo ""
echo "Next steps:"
echo "1. Configure backend/.env with MongoDB URI"
echo "2. Run database seed:"
echo "   cd backend && npm run seed"
echo "3. Start backend:"
echo "   cd backend && npm run dev"
echo "4. In another terminal, start frontend:"
echo "   cd frontend && npm run dev"
echo ""
echo "Access app at: http://localhost:5173"
echo "Test credentials (after seeding):"
echo "  Admin: admin@local.test / Password123!"
echo "  Owner: owner1@local.test / Password123!"
echo ""
