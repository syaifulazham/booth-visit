#!/bin/bash

# Server Deployment Commands - Fresh Database Reset
# Run these commands on your production server

echo "🚀 Starting fresh deployment with database reset..."

# Navigate to project directory
cd ~/apps/booth-visit

# Pull latest code
echo "📥 Pulling latest code..."
git pull origin main

# Install dependencies (if any new packages)
echo "📦 Installing dependencies..."
npm install

# Reset database (this will delete all data and reapply all migrations)
echo "🗄️ Resetting database..."
npx prisma migrate reset --force

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate

# Build the application
echo "🏗️ Building application..."
npm run build

# Restart PM2
echo "🔄 Restarting application..."
pm2 restart stemai

# Show status
echo "✅ Deployment complete!"
pm2 status

echo ""
echo "🎉 Application is now running!"
echo "Visit: https://stemai.techlympics.my"
echo ""
echo "To view logs: pm2 logs stemai"
echo "To monitor: pm2 monit"
