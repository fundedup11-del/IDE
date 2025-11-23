#!/bin/bash

echo "🚀 ExternAI Vercel Deployment Script"
echo "======================================"
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null
then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

echo "✅ Vercel CLI ready"
echo ""

# Login to Vercel
echo "🔐 Logging in to Vercel..."
vercel login

echo ""
echo "📦 Deploying to Vercel..."
echo ""

# Deploy
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Copy your deployment URL"
echo "2. Go to Firebase Console: https://console.firebase.google.com/project/exten-90c72/authentication/settings"
echo "3. Add your Vercel domain to 'Authorized domains'"
echo "4. Test your deployed app!"
echo ""
