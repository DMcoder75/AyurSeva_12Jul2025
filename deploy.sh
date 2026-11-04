#!/bin/bash

echo "🚀 Firebase Deployment Script for Ayur-Seva Platform"
echo "=================================================="

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools
fi

# Check if user is logged in
echo "🔐 Checking Firebase authentication..."
if ! firebase projects:list &> /dev/null; then
    echo "🔑 Please login to Firebase..."
    firebase login
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the project
echo "🔨 Building the project..."
npm run build

# Deploy to Firebase
echo "🚀 Deploying to Firebase..."
firebase deploy

echo "✅ Deployment complete!"
echo "🌐 Your site should be live at: https://ayur-seva-platform.web.app"
echo ""
echo "📋 Next steps:"
echo "1. Go to Firebase Console: https://console.firebase.google.com"
echo "2. Navigate to Hosting → Add custom domain"
echo "3. Add your domain: ayur-seva.com"
echo "4. Follow the DNS configuration instructions"

