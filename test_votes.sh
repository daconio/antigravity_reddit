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

# Create Post to vote on
echo -e "\n\nCreating Post for Voting..."
POST_RES=$(curl -s -X POST http://localhost:5001/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title": "Vote Test Post", "content": "Testing voting", "community": "test"}')

POST_ID=$(echo $POST_RES | grep -o '"_id":"[^"]*' | head -n 1 | cut -d'"' -f4)
echo "Post ID: $POST_ID"

# Upvote
echo -e "\n\nUpvoting..."
echo "URL: http://localhost:5001/api/posts/$POST_ID/vote"
curl -v -X POST http://localhost:5001/api/posts/$POST_ID/vote \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"value": 1}'

# Downvote (Change vote)
echo -e "\n\nDownvoting (Change)..."
curl -s -X POST http://localhost:5001/api/posts/$POST_ID/vote \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"value": -1}'

# Downvote again (Toggle off)
echo -e "\n\nDownvoting (Toggle Off)..."
curl -s -X POST http://localhost:5001/api/posts/$POST_ID/vote \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"value": -1}'

# Delete Post
echo -e "\n\nDeleting Post..."
curl -s -X DELETE http://localhost:5001/api/posts/$POST_ID \
  -H "Authorization: Bearer $TOKEN"
