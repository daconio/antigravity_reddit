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

# Create Post to comment on
echo -e "\n\nCreating Post for Comment..."
POST_RES=$(curl -s -X POST http://localhost:5001/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title": "Comment Test Post", "content": "Testing comments", "community": "test"}')

POST_ID=$(echo $POST_RES | grep -o '"_id":"[^"]*' | cut -d'"' -f4)
echo "Post ID: $POST_ID"

# Create Comment
echo -e "\n\nCreating Comment..."
COMMENT_RES=$(curl -s -X POST http://localhost:5001/api/comments/$POST_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"content": "This is a test comment"}')

echo $COMMENT_RES
COMMENT_ID=$(echo $COMMENT_RES | grep -o '"_id":"[^"]*' | cut -d'"' -f4)

echo -e "\n\nComment ID: $COMMENT_ID"

# Get Comments
echo -e "\n\nGetting Comments..."
curl -s -X GET http://localhost:5001/api/comments/$POST_ID

# Delete Comment
echo -e "\n\nDeleting Comment..."
curl -s -X DELETE http://localhost:5001/api/comments/$COMMENT_ID \
  -H "Authorization: Bearer $TOKEN"
