#!/bin/bash

# Script to send blog post notification to subscribers
# Usage: ./scripts/send-notification.sh your-post-slug

if [ -z "$1" ]; then
  echo "Error: Post slug is required"
  echo "Usage: ./scripts/send-notification.sh your-post-slug"
  exit 1
fi

POST_SLUG=$1

# Load environment variables
if [ -f .env.local ]; then
  export $(cat .env.local | grep -v '^#' | xargs)
fi

if [ -z "$NOTIFICATION_API_SECRET" ]; then
  echo "Error: NOTIFICATION_API_SECRET not found in .env.local"
  exit 1
fi

if [ -z "$NEXT_PUBLIC_SITE_URL" ]; then
  SITE_URL="http://localhost:3000"
else
  SITE_URL=$NEXT_PUBLIC_SITE_URL
fi

echo "Sending notification for post: $POST_SLUG"
echo "Using site URL: $SITE_URL"

response=$(curl -s -w "\n%{http_code}" -X POST "$SITE_URL/api/send-notification" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $NOTIFICATION_API_SECRET" \
  -d "{\"postSlug\": \"$POST_SLUG\"}")

http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

if [ "$http_code" -eq 200 ]; then
  echo "✓ Success!"
  echo "$body" | jq .
else
  echo "✗ Failed with status code: $http_code"
  echo "$body"
  exit 1
fi
