#!/bin/bash

# Login to get token
echo "Logging in..."
RESPONSE=$(curl -s -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}')

TOKEN=$(echo $RESPONSE | grep -o '"token":"[^"]*' | head -n 1 | cut -d'"' -f4)

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
  -d '{"title": "Nested Comments Test", "content": "Testing nested comments", "community": "test"}')

POST_ID=$(echo $POST_RES | grep -o '"_id":"[^"]*' | head -n 1 | cut -d'"' -f4)
echo "Post ID: $POST_ID"

# Create top-level comment
echo -e "\n\nCreating top-level comment..."
COMMENT1_RES=$(curl -s -X POST http://localhost:5001/api/comments/$POST_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"content": "This is a top-level comment"}')

COMMENT1_ID=$(echo $COMMENT1_RES | grep -o '"_id":"[^"]*' | head -n 1 | cut -d'"' -f4)
echo "Comment 1 ID: $COMMENT1_ID"

# Create reply to comment 1
echo -e "\n\nCreating reply to comment 1..."
COMMENT2_RES=$(curl -s -X POST http://localhost:5001/api/comments/$POST_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"content\": \"This is a reply to comment 1\", \"parentComment\": \"$COMMENT1_ID\"}")

COMMENT2_ID=$(echo $COMMENT2_RES | grep -o '"_id":"[^"]*' | head -n 1 | cut -d'"' -f4)
echo "Comment 2 ID: $COMMENT2_ID"

# Create nested reply
echo -e "\n\nCreating nested reply..."
curl -s -X POST http://localhost:5001/api/comments/$POST_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"content\": \"This is a nested reply\", \"parentComment\": \"$COMMENT2_ID\"}"

# Get all comments
echo -e "\n\nGetting all comments..."
curl -s -X GET http://localhost:5001/api/comments/$POST_ID
