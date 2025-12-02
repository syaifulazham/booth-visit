# Deployment Guide for stemai.techlympics.my

## Prerequisites

- Ubuntu/Debian server with sudo access
- Node.js 18+ installed
- Nginx installed
- Domain DNS configured to point to your server IP

## Step 1: Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18 (if not already installed)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Nginx (if not already installed)
sudo apt install -y nginx

# Install PM2 for process management
sudo npm install -g pm2

# Install Certbot for SSL
sudo apt install -y certbot python3-certbot-nginx
```

## Step 2: Prepare Application

```bash
# Clone or upload your application to server
cd /var/www
sudo mkdir -p stemai.techlympics.my
sudo chown -R $USER:$USER stemai.techlympics.my
cd stemai.techlympics.my

# Copy your application files here
# Then install dependencies
npm install

# Build the Next.js application
npm run build
```

## Step 3: Environment Configuration

```bash
# Create .env file
nano .env
```

Add your environment variables:
```env
DATABASE_URL="mysql://user:password@localhost:3306/booth-visit-db"
NEXTAUTH_URL="https://stemai.techlympics.my"
NEXTAUTH_SECRET="your-secret-key-here"
```

## Step 4: Setup Database

```bash
# Run Prisma migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate
```

## Step 5: Configure Nginx

```bash
# Copy the nginx configuration
sudo cp nginx-stemai.conf /etc/nginx/sites-available/stemai.techlympics.my

# Create symbolic link to enable the site
sudo ln -s /etc/nginx/sites-available/stemai.techlympics.my /etc/nginx/sites-enabled/

# Test nginx configuration
sudo nginx -t

# If test passes, reload nginx
sudo systemctl reload nginx
```

## Step 6: Setup SSL Certificate

```bash
# Obtain SSL certificate from Let's Encrypt
sudo certbot --nginx -d stemai.techlympics.my -d www.stemai.techlympics.my

# Follow the prompts and select:
# - Enter your email
# - Agree to terms
# - Choose whether to redirect HTTP to HTTPS (recommended: Yes)

# Verify auto-renewal
sudo certbot renew --dry-run
```

## Step 7: Start Application with PM2

```bash
# Start the application on port 3001
pm2 start npm --name "stemai-booth" -- start -- -p 3001

# Save PM2 process list
pm2 save

# Setup PM2 to start on system boot
pm2 startup
# Follow the command output instructions

# Check status
pm2 status
pm2 logs stemai-booth
```

## Step 8: Configure Firewall

```bash
# Allow Nginx through firewall
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable

# Check status
sudo ufw status
```

## Useful Commands

### Application Management
```bash
# View logs
pm2 logs stemai-booth

# Restart application
pm2 restart stemai-booth

# Stop application
pm2 stop stemai-booth

# View process info
pm2 info stemai-booth

# Monitor
pm2 monit
```

### Nginx Management
```bash
# Test configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx

# Restart nginx
sudo systemctl restart nginx

# View error logs
sudo tail -f /var/log/nginx/stemai.techlympics.my-error.log

# View access logs
sudo tail -f /var/log/nginx/stemai.techlympics.my-access.log
```

### Database Management
```bash
# Access MySQL
mysql -u root -p

# Backup database
mysqldump -u root -p booth-visit-db > backup-$(date +%Y%m%d).sql

# Restore database
mysql -u root -p booth-visit-db < backup-20231202.sql
```

### SSL Certificate Management
```bash
# Renew SSL certificate manually
sudo certbot renew

# Check certificate status
sudo certbot certificates

# Test auto-renewal
sudo certbot renew --dry-run
```

## Troubleshooting

### Application won't start
```bash
# Check PM2 logs
pm2 logs stemai-booth --lines 100

# Check if port 3001 is in use
sudo lsof -i :3001

# Restart the application
pm2 restart stemai-booth
```

### Nginx errors
```bash
# Check nginx error logs
sudo tail -f /var/log/nginx/error.log

# Test configuration
sudo nginx -t

# Check if nginx is running
sudo systemctl status nginx
```

### Database connection issues
```bash
# Check if MySQL is running
sudo systemctl status mysql

# Test database connection
mysql -u your_user -p booth-visit-db

# Check DATABASE_URL in .env file
cat .env | grep DATABASE_URL
```

### SSL certificate issues
```bash
# Check certificate status
sudo certbot certificates

# Force renewal
sudo certbot renew --force-renewal

# Check nginx SSL configuration
sudo nginx -t
```

## Performance Optimization

### Enable HTTP/2
Already configured in the nginx config file.

### Setup Log Rotation
```bash
# PM2 log rotation
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### Database Optimization
```sql
-- Add indexes for frequently queried fields
-- Already in Prisma schema
```

## Monitoring

### Setup monitoring with PM2 Plus (optional)
```bash
pm2 link <secret_key> <public_key>
```

### Basic health check
```bash
# Check if application is responding
curl https://stemai.techlympics.my/health

# Check SSL certificate
curl -I https://stemai.techlympics.my
```

## Backup Strategy

### Automated daily backup script
```bash
# Create backup script
sudo nano /usr/local/bin/backup-stemai.sh
```

Add:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/stemai"
mkdir -p $BACKUP_DIR

# Database backup
mysqldump -u root -p'your_password' booth-visit-db | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Keep only last 7 days
find $BACKUP_DIR -name "db_*.sql.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
```

```bash
# Make executable
sudo chmod +x /usr/local/bin/backup-stemai.sh

# Add to crontab (daily at 2 AM)
sudo crontab -e
# Add line:
# 0 2 * * * /usr/local/bin/backup-stemai.sh >> /var/log/stemai-backup.log 2>&1
```

## Security Checklist

- [x] SSL/TLS enabled with Let's Encrypt
- [x] Firewall configured (UFW)
- [x] Security headers configured in Nginx
- [x] Database credentials in .env (not committed)
- [x] NEXTAUTH_SECRET set to secure random string
- [ ] Regular security updates: `sudo apt update && sudo apt upgrade`
- [ ] Regular backups configured
- [ ] Monitoring setup
- [ ] Rate limiting (consider adding if needed)

## Updates and Maintenance

### Deploy new version
```bash
cd /var/www/stemai.techlympics.my

# Pull latest code
git pull origin main

# Install dependencies
npm install

# Run migrations if needed
npx prisma migrate deploy

# Build
npm run build

# Restart application
pm2 restart stemai-booth

# Check logs
pm2 logs stemai-booth --lines 50
```

## Support

For issues, check:
1. PM2 logs: `pm2 logs stemai-booth`
2. Nginx error logs: `sudo tail -f /var/log/nginx/stemai.techlympics.my-error.log`
3. Application logs: Check your logging configuration
