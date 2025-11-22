#!/bin/bash

# Test Search Functionality

echo "Testing search functionality..."
echo ""

# Test 1: Search with a query
echo "Test 1: Search for posts containing 'test'"
curl -s "http://localhost:5000/api/posts/search?q=test" | python3 -m json.tool
echo ""
echo "---"
echo ""

# Test 2: Search with empty query (should fail)
echo "Test 2: Search with empty query (should return error)"
curl -s "http://localhost:5000/api/posts/search?q=" | python3 -m json.tool
echo ""
echo "---"
echo ""

# Test 3: Search for a specific word
echo "Test 3: Search for posts containing 'hello'"
curl -s "http://localhost:5000/api/posts/search?q=hello" | python3 -m json.tool
echo ""
echo "---"
echo ""

# Test 4: Search by community
echo "Test 4: Search for posts in 'general' community"
curl -s "http://localhost:5000/api/posts/search?q=general" | python3 -m json.tool
echo ""

echo "Search tests completed!"
