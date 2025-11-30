# API Examples & cURL Commands

Complete reference for testing the Villa & Garden Maintenance API with cURL commands.

## Authentication

### 1. Login

**Endpoint**: `POST /api/auth/login`

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@local.test",
    "password": "Password123!"
  }'
```

**Response**:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "name": "Admin User",
    "email": "admin@local.test",
    "role": "admin"
  }
}
```

**Note**: Token is also stored in httpOnly cookie automatically.

### 2. Register (Owner)

**Endpoint**: `POST /api/auth/register`

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Owner",
    "email": "john@example.com",
    "phone": "+1234567890",
    "password": "SecurePass123!",
    "apartmentNumber": "A201"
  }'
```

**Response**:
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64a1b2c3d4e5f6g7h8i9j0k2",
    "name": "John Owner",
    "email": "john@example.com",
    "role": "owner"
  }
}
```

### 3. Logout

**Endpoint**: `POST /api/auth/logout`

```bash
TOKEN="your_jwt_token_here"

curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer $TOKEN"
```

**Response**:
```json
{
  "message": "Logged out successfully"
}
```

---

## Service Requests

### 1. Create Service Request (Owner)

**Endpoint**: `POST /api/requests`

```bash
TOKEN="your_jwt_token_here"

curl -X POST http://localhost:5000/api/requests \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "type": "Plumbing",
    "details": "Leaking faucet in master bathroom kitchen",
    "images": [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg"
    ]
  }'
```

**Response**:
```json
{
  "_id": "64a1b2c3d4e5f6g7h8i9j0k3",
  "ownerId": "64a1b2c3d4e5f6g7h8i9j0k2",
  "type": "Plumbing",
  "details": "Leaking faucet in master bathroom",
  "images": ["https://example.com/image1.jpg"],
  "status": "open",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

### 2. Get All Requests (Admin only)

**Endpoint**: `GET /api/requests?page=1&limit=10`

```bash
TOKEN="admin_token_here"

curl -X GET "http://localhost:5000/api/requests?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

**Response**:
```json
{
  "requests": [
    {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k3",
      "ownerId": {
        "_id": "64a1b2c3d4e5f6g7h8i9j0k2",
        "name": "John Owner",
        "email": "john@example.com"
      },
      "type": "Plumbing",
      "details": "Leaking faucet in master bathroom",
      "status": "open",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "pages": 1
  }
}
```

### 3. Get My Requests (Owner)

**Endpoint**: `GET /api/requests/my?page=1&limit=10`

```bash
TOKEN="owner_token_here"

curl -X GET "http://localhost:5000/api/requests/my?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

**Response**: Same as above, but only owner's requests.

### 4. Update Request Status (Admin)

**Endpoint**: `PUT /api/requests/:id`

```bash
TOKEN="admin_token_here"
REQUEST_ID="64a1b2c3d4e5f6g7h8i9j0k3"

curl -X PUT "http://localhost:5000/api/requests/$REQUEST_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "status": "assigned",
    "assignedTo": "staff_id_here"
  }'
```

**Response**:
```json
{
  "_id": "64a1b2c3d4e5f6g7h8i9j0k3",
  "status": "assigned",
  "assignedTo": "64a1b2c3d4e5f6g7h8i9j0k4",
  "updatedAt": "2024-01-15T11:00:00Z"
}
```

### 5. Delete Request

**Endpoint**: `DELETE /api/requests/:id`

```bash
TOKEN="your_token_here"
REQUEST_ID="64a1b2c3d4e5f6g7h8i9j0k3"

curl -X DELETE "http://localhost:5000/api/requests/$REQUEST_ID" \
  -H "Authorization: Bearer $TOKEN"
```

**Response**:
```json
{
  "message": "Request deleted"
}
```

---

## Invoices

### 1. Create Invoice (Admin only)

**Endpoint**: `POST /api/invoices`

```bash
TOKEN="admin_token_here"

curl -X POST http://localhost:5000/api/invoices \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "ownerId": "64a1b2c3d4e5f6g7h8i9j0k2",
    "amount": 5000,
    "dueDate": "2024-02-15"
  }'
```

**Response**:
```json
{
  "_id": "64a1b2c3d4e5f6g7h8i9j0k5",
  "ownerId": "64a1b2c3d4e5f6g7h8i9j0k2",
  "amount": 5000,
  "dueDate": "2024-02-15T00:00:00Z",
  "paid": false,
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### 2. Get Invoices

**Endpoint**: `GET /api/invoices?page=1&limit=10`

```bash
TOKEN="your_token_here"

curl -X GET "http://localhost:5000/api/invoices?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

**Response**:
```json
{
  "invoices": [
    {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k5",
      "ownerId": {
        "_id": "64a1b2c3d4e5f6g7h8i9j0k2",
        "name": "John Owner"
      },
      "amount": 5000,
      "dueDate": "2024-02-15T00:00:00Z",
      "paid": false
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 3,
    "pages": 1
  }
}
```

### 3. Process Payment (Fake)

**Endpoint**: `POST /api/invoices/:id/pay`

```bash
TOKEN="owner_token_here"
INVOICE_ID="64a1b2c3d4e5f6g7h8i9j0k5"

curl -X POST "http://localhost:5000/api/invoices/$INVOICE_ID/pay" \
  -H "Authorization: Bearer $TOKEN"
```

**Response**:
```json
{
  "message": "Payment processed successfully",
  "invoice": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k5",
    "paid": true,
    "paymentTxId": "TXN_1705314600000"
  },
  "transactionId": "TXN_1705314600000"
}
```

---

## Staff Management (Admin only)

### 1. Create Staff

**Endpoint**: `POST /api/staff`

```bash
TOKEN="admin_token_here"

curl -X POST http://localhost:5000/api/staff \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Mike Johnson",
    "role": "Plumber",
    "phone": "+1-555-0100"
  }'
```

**Response**:
```json
{
  "_id": "64a1b2c3d4e5f6g7h8i9j0k4",
  "name": "Mike Johnson",
  "role": "Plumber",
  "phone": "+1-555-0100",
  "assignedTasks": [],
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### 2. Get All Staff

**Endpoint**: `GET /api/staff?page=1&limit=10`

```bash
TOKEN="admin_token_here"

curl -X GET "http://localhost:5000/api/staff?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

**Response**:
```json
{
  "staff": [
    {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k4",
      "name": "Mike Johnson",
      "role": "Plumber",
      "phone": "+1-555-0100",
      "assignedTasks": []
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 2,
    "pages": 1
  }
}
```

---

## Schedules

### 1. Create Schedule (Admin only)

**Endpoint**: `POST /api/schedules`

```bash
TOKEN="admin_token_here"

curl -X POST http://localhost:5000/api/schedules \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "date": "2024-02-01T10:00:00Z",
    "serviceType": "Garden Maintenance",
    "staffId": "64a1b2c3d4e5f6g7h8i9j0k4",
    "owners": [
      "64a1b2c3d4e5f6g7h8i9j0k2",
      "64a1b2c3d4e5f6g7h8i9j0k9"
    ],
    "notes": "Weekly watering and pruning"
  }'
```

**Response**:
```json
{
  "_id": "64a1b2c3d4e5f6g7h8i9j0k6",
  "date": "2024-02-01T10:00:00Z",
  "serviceType": "Garden Maintenance",
  "staffId": "64a1b2c3d4e5f6g7h8i9j0k4",
  "owners": ["64a1b2c3d4e5f6g7h8i9j0k2"],
  "notes": "Weekly watering and pruning",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### 2. Get All Schedules

**Endpoint**: `GET /api/schedules?page=1&limit=10`

```bash
TOKEN="your_token_here"

curl -X GET "http://localhost:5000/api/schedules?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

**Response**:
```json
{
  "schedules": [
    {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k6",
      "date": "2024-02-01T10:00:00Z",
      "serviceType": "Garden Maintenance",
      "staffId": {
        "_id": "64a1b2c3d4e5f6g7h8i9j0k4",
        "name": "Mike Johnson"
      },
      "notes": "Weekly watering and pruning"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

---

## Notices

### 1. Create Notice (Admin only)

**Endpoint**: `POST /api/notices`

```bash
TOKEN="admin_token_here"

curl -X POST http://localhost:5000/api/notices \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Maintenance Window",
    "body": "Garden maintenance scheduled for February 1-5. Please ensure gates are unlocked.",
    "visibleTo": "all"
  }'
```

**Response**:
```json
{
  "_id": "64a1b2c3d4e5f6g7h8i9j0k7",
  "title": "Maintenance Window",
  "body": "Garden maintenance scheduled for February 1-5...",
  "visibleTo": "all",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### 2. Get Notices

**Endpoint**: `GET /api/notices?page=1&limit=10`

```bash
curl -X GET "http://localhost:5000/api/notices?page=1&limit=10"
```

**Response**:
```json
{
  "notices": [
    {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k7",
      "title": "Maintenance Window",
      "body": "Garden maintenance scheduled for February 1-5...",
      "visibleTo": "all",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

---

## Users (Admin only)

### 1. Get All Users

**Endpoint**: `GET /api/users?page=1&limit=10`

```bash
TOKEN="admin_token_here"

curl -X GET "http://localhost:5000/api/users?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

**Response**:
```json
{
  "users": [
    {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
      "name": "Admin User",
      "email": "admin@local.test",
      "phone": "+1234567890",
      "role": "admin",
      "createdAt": "2024-01-15T08:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 3,
    "pages": 1
  }
}
```

### 2. Get User by ID

**Endpoint**: `GET /api/users/:id`

```bash
TOKEN="your_token_here"
USER_ID="64a1b2c3d4e5f6g7h8i9j0k2"

curl -X GET "http://localhost:5000/api/users/$USER_ID" \
  -H "Authorization: Bearer $TOKEN"
```

### 3. Update User (Admin)

**Endpoint**: `PUT /api/users/:id`

```bash
TOKEN="admin_token_here"
USER_ID="64a1b2c3d4e5f6g7h8i9j0k2"

curl -X PUT "http://localhost:5000/api/users/$USER_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "phone": "+1-555-0200",
    "apartmentNumber": "A202"
  }'
```

### 4. Delete User (Admin)

**Endpoint**: `DELETE /api/users/:id`

```bash
TOKEN="admin_token_here"
USER_ID="64a1b2c3d4e5f6g7h8i9j0k2"

curl -X DELETE "http://localhost:5000/api/users/$USER_ID" \
  -H "Authorization: Bearer $TOKEN"
```

---

## Error Handling

### Common Error Responses

**401 Unauthorized - No Token**
```json
{
  "error": "No token provided"
}
```

**401 Unauthorized - Invalid Token**
```json
{
  "error": "Invalid or expired token"
}
```

**403 Forbidden - Admin Only**
```json
{
  "error": "Admin access required"
}
```

**400 Bad Request - Validation Error**
```json
{
  "error": "Email and password required"
}
```

**404 Not Found**
```json
{
  "error": "Request not found"
}
```

---

## Testing Script

Save as `test-api.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost:5000"

echo "=== Testing Villa & Garden Maintenance API ==="

# 1. Login
echo -e "\n1. Testing Login..."
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"admin@local.test",
    "password":"Password123!"
  }')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo "Token: $TOKEN"

# 2. Get Requests
echo -e "\n2. Testing Get Requests..."
curl -s -X GET "$BASE_URL/api/requests?page=1&limit=5" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# 3. Create Request
echo -e "\n3. Testing Create Request..."
curl -s -X POST $BASE_URL/api/requests \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "type":"Test",
    "details":"Testing API",
    "images":[]
  }' | jq '.'

echo -e "\n=== Tests Complete ==="
```

Run with:
```bash
chmod +x test-api.sh
./test-api.sh
```

---

## Postman Collection

Import this JSON into Postman for easy API testing:

```json
{
  "info": {
    "name": "Villa & Garden Maintenance API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/api/auth/login",
            "body": {
              "raw": "{\"email\":\"admin@local.test\",\"password\":\"Password123!\"}"
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000"
    },
    {
      "key": "token",
      "value": ""
    }
  ]
}
```

---

For more details, see the main README.md and DEPLOYMENT.md files.
