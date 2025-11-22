#!/bin/bash

# Login to get token
echo "Logging in..."
RESPONSE=$(curl -s -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}')

TOKEN=$(echo $RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "Login failed. Make sure user exists."
  exit 1
fi

echo "Token: $TOKEN"

# Create Post
echo -e "\n\nCreating Post..."
POST_RES=$(curl -s -X POST http://localhost:5001/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title": "Test Post", "content": "This is a test post content", "community": "technology"}')

echo $POST_RES
POST_ID=$(echo $POST_RES | grep -o '"_id":"[^"]*' | cut -d'"' -f4)

echo -e "\n\nPost ID: $POST_ID"

# Get Posts
echo -e "\n\nGetting All Posts..."
curl -s -X GET http://localhost:5001/api/posts

# Get Single Post
echo -e "\n\nGetting Single Post..."
curl -s -X GET http://localhost:5001/api/posts/$POST_ID

# Delete Post
echo -e "\n\nDeleting Post..."
curl -s -X DELETE http://localhost:5001/api/posts/$POST_ID \
  -H "Authorization: Bearer $TOKEN"
