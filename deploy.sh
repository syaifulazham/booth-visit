#!/bin/bash

# Deployment script for stemai.techlympics.my
# Run this script on your production server

set -e  # Exit on error

echo "================================================"
echo "   STEMAI Booth Visit System - Deployment"
echo "================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
DOMAIN="stemai.techlympics.my"
APP_DIR="/var/www/${DOMAIN}"
APP_PORT=3001
PM2_APP_NAME="stemai-booth"

# Function to print colored messages
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${NC}→ $1${NC}"
}

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
    print_error "Please do not run as root. Run as regular user with sudo privileges."
    exit 1
fi

print_info "Starting deployment process..."
echo ""

# Check prerequisites
print_info "Checking prerequisites..."

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    print_success "Node.js installed: $NODE_VERSION"
else
    print_error "Node.js not found. Please install Node.js 18+"
    exit 1
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    print_success "npm installed: $NPM_VERSION"
else
    print_error "npm not found"
    exit 1
fi

# Check PM2
if command -v pm2 &> /dev/null; then
    print_success "PM2 installed"
else
    print_warning "PM2 not found. Installing PM2..."
    sudo npm install -g pm2
    print_success "PM2 installed"
fi

# Check Nginx
if command -v nginx &> /dev/null; then
    print_success "Nginx installed"
else
    print_error "Nginx not found. Please install nginx first."
    exit 1
fi

echo ""

# Navigate to application directory
if [ -d "$APP_DIR" ]; then
    print_info "Navigating to application directory: $APP_DIR"
    cd "$APP_DIR"
else
    print_error "Application directory not found: $APP_DIR"
    print_info "Please create the directory and copy your application files first."
    exit 1
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    print_error ".env file not found!"
    print_info "Please create a .env file with required environment variables."
    exit 1
else
    print_success ".env file found"
fi

# Install dependencies
print_info "Installing dependencies..."
npm install
print_success "Dependencies installed"

# Run Prisma migrations
print_info "Running database migrations..."
npx prisma migrate deploy
print_success "Migrations completed"

# Generate Prisma client
print_info "Generating Prisma client..."
npx prisma generate
print_success "Prisma client generated"

# Build Next.js application
print_info "Building Next.js application..."
npm run build
print_success "Build completed"

# Setup Nginx configuration
print_info "Setting up Nginx configuration..."
if [ -f "nginx-stemai.conf" ]; then
    sudo cp nginx-stemai.conf /etc/nginx/sites-available/${DOMAIN}
    
    if [ ! -L "/etc/nginx/sites-enabled/${DOMAIN}" ]; then
        sudo ln -s /etc/nginx/sites-available/${DOMAIN} /etc/nginx/sites-enabled/
    fi
    
    # Test nginx configuration
    if sudo nginx -t; then
        print_success "Nginx configuration valid"
        sudo systemctl reload nginx
        print_success "Nginx reloaded"
    else
        print_error "Nginx configuration test failed"
        exit 1
    fi
else
    print_warning "nginx-stemai.conf not found. Skipping Nginx setup."
fi

# Stop existing PM2 process if running
if pm2 list | grep -q "$PM2_APP_NAME"; then
    print_info "Stopping existing PM2 process..."
    pm2 stop $PM2_APP_NAME
    pm2 delete $PM2_APP_NAME
    print_success "Existing process stopped"
fi

# Start application with PM2
print_info "Starting application with PM2 on port $APP_PORT..."
pm2 start npm --name "$PM2_APP_NAME" -- start -- -p $APP_PORT

# Save PM2 process list
pm2 save

# Setup PM2 startup script (only if not already setup)
print_info "Setting up PM2 startup script..."
pm2 startup | grep -v "sudo" | bash || true

print_success "Application started"

# Show PM2 status
echo ""
print_info "Current PM2 status:"
pm2 list

echo ""
print_success "Deployment completed successfully!"
echo ""
print_info "Your application is now running at: https://${DOMAIN}"
print_info "View logs with: pm2 logs ${PM2_APP_NAME}"
print_info "Monitor with: pm2 monit"
echo ""

# SSL Certificate reminder
if [ ! -d "/etc/letsencrypt/live/${DOMAIN}" ]; then
    print_warning "SSL certificate not found!"
    echo ""
    print_info "To setup SSL certificate, run:"
    echo "  sudo certbot --nginx -d ${DOMAIN} -d www.${DOMAIN}"
    echo ""
fi

print_success "All done! 🚀"
