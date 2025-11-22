#!/bin/bash

# Register
echo "Registering user..."
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "email": "test@example.com", "password": "password123"}'

echo -e "\n\nLogging in..."
# Login and capture token
RESPONSE=$(curl -s -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}')

echo $RESPONSE
TOKEN=$(echo $RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

echo -e "\n\nToken: $TOKEN"

if [ -z "$TOKEN" ]; then
  echo "Login failed"
  exit 1
fi

echo -e "\n\nGetting User Profile..."
curl -X GET http://localhost:5001/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
