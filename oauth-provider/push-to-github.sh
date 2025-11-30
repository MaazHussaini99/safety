#!/bin/bash

# Commands to push OAuth provider to GitHub

echo "Pushing OAuth provider to GitHub..."

cd /home/user/safety/oauth-provider

# Add remote (already done, but safe to run again)
git remote add origin https://github.com/MaazHussaini99/oauth.git 2>/dev/null || git remote set-url origin https://github.com/MaazHussaini99/oauth.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main

echo ""
echo "✅ OAuth provider pushed to GitHub!"
echo ""
echo "Next step: Deploy to Vercel"
echo "Go to: https://vercel.com/new"
echo "Import: https://github.com/MaazHussaini99/oauth"
