#!/bin/bash

# Backup .env
cp .env .env.backup

# Fix RESEND_API_KEY (remove newlines)
echo "Fixing .env file..."

# Create temp file with fixed content
cat .env | tr -d '\r' > .env.tmp

# Replace .env
mv .env.tmp .env

echo "✅ .env file fixed!"
echo ""
echo "Please verify your .env contains:"
echo "RESEND_API_KEY=re_ZSpZUKwm_EK9b3352zw4mYVPv5zukxgza"
