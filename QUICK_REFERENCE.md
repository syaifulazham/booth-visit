# Quick Reference Guide - stemai.techlympics.my

## 🚀 Quick Deployment

```bash
# On your server, navigate to app directory
cd /var/www/stemai.techlympics.my

# Make deploy script executable
chmod +x deploy.sh

# Run deployment script
./deploy.sh
```

## 📁 Important File Locations

| Item | Path |
|------|------|
| Application | `/var/www/stemai.techlympics.my` |
| Nginx Config | `/etc/nginx/sites-available/stemai.techlympics.my` |
| SSL Certificates | `/etc/letsencrypt/live/stemai.techlympics.my/` |
| Nginx Access Logs | `/var/log/nginx/stemai.techlympics.my-access.log` |
| Nginx Error Logs | `/var/log/nginx/stemai.techlympics.my-error.log` |
| PM2 Logs | `~/.pm2/logs/` |

## 🔧 Common Commands

### Application Management
```bash
# View application status
pm2 status

# View logs (real-time)
pm2 logs stemai-booth

# View last 100 log lines
pm2 logs stemai-booth --lines 100

# Restart application
pm2 restart stemai-booth

# Stop application
pm2 stop stemai-booth

# Monitor resources
pm2 monit

# Show application info
pm2 info stemai-booth
```

### Nginx Management
```bash
# Test configuration
sudo nginx -t

# Reload Nginx (no downtime)
sudo systemctl reload nginx

# Restart Nginx
sudo systemctl restart nginx

# Check Nginx status
sudo systemctl status nginx

# View error logs (real-time)
sudo tail -f /var/log/nginx/stemai.techlympics.my-error.log

# View access logs (real-time)
sudo tail -f /var/log/nginx/stemai.techlympics.my-access.log
```

### Database Management
```bash
# Connect to MySQL
mysql -u root -p

# Run migrations
cd /var/www/stemai.techlympics.my
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate

# Open Prisma Studio (local only)
npx prisma studio

# Backup database
mysqldump -u root -p booth-visit-db > backup-$(date +%Y%m%d-%H%M%S).sql

# Restore database
mysql -u root -p booth-visit-db < backup-20231202-120000.sql
```

### SSL Certificate
```bash
# Obtain/renew certificate
sudo certbot --nginx -d stemai.techlympics.my -d www.stemai.techlympics.my

# Check certificate status
sudo certbot certificates

# Test auto-renewal
sudo certbot renew --dry-run

# Force renewal
sudo certbot renew --force-renewal
```

## 📊 Monitoring Commands

### Check Application Health
```bash
# HTTP health check
curl http://localhost:3001/health

# HTTPS health check
curl https://stemai.techlympics.my/health

# Check if app is listening on port
sudo lsof -i :3001

# Check PM2 process
pm2 list
```

### Check System Resources
```bash
# Disk space
df -h

# Memory usage
free -h

# CPU usage
top

# PM2 resource monitoring
pm2 monit

# Check all ports in use
sudo netstat -tulpn
```

### Check Logs
```bash
# Last 50 lines of application logs
pm2 logs stemai-booth --lines 50

# Nginx error logs
sudo tail -n 100 /var/log/nginx/stemai.techlympics.my-error.log

# System logs
sudo journalctl -u nginx -n 50

# MySQL logs
sudo tail -f /var/log/mysql/error.log
```

## 🔄 Update Application

```bash
cd /var/www/stemai.techlympics.my

# Pull latest code
git pull origin main

# Install dependencies
npm install

# Run migrations
npx prisma migrate deploy

# Build
npm run build

# Restart
pm2 restart stemai-booth

# Verify
pm2 logs stemai-booth --lines 20
```

## 🐛 Troubleshooting

### Application Won't Start
```bash
# Check PM2 logs
pm2 logs stemai-booth --lines 100

# Check if port is in use
sudo lsof -i :3001

# Kill process on port (if needed)
sudo kill -9 $(sudo lsof -t -i:3001)

# Restart application
pm2 restart stemai-booth
```

### Database Connection Error
```bash
# Check MySQL status
sudo systemctl status mysql

# Test connection
mysql -u your_user -p booth-visit-db

# Verify DATABASE_URL in .env
cd /var/www/stemai.techlympics.my
cat .env | grep DATABASE_URL

# Restart MySQL
sudo systemctl restart mysql
```

### Nginx 502 Bad Gateway
```bash
# Check if app is running
pm2 status

# Check if app is listening
sudo lsof -i :3001

# Check Nginx error logs
sudo tail -f /var/log/nginx/stemai.techlympics.my-error.log

# Restart application
pm2 restart stemai-booth

# Restart Nginx
sudo systemctl restart nginx
```

### SSL Certificate Issues
```bash
# Check certificate
sudo certbot certificates

# Renew certificate
sudo certbot renew

# If renewal fails, try force renewal
sudo certbot renew --force-renewal

# Check Nginx SSL config
sudo nginx -t
```

## 🔒 Security Commands

### Firewall
```bash
# Check firewall status
sudo ufw status

# Allow Nginx
sudo ufw allow 'Nginx Full'

# Allow SSH
sudo ufw allow OpenSSH

# Enable firewall
sudo ufw enable
```

### Updates
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Update npm packages
cd /var/www/stemai.techlympics.my
npm update

# Update PM2
sudo npm update -g pm2
```

## 💾 Backup Commands

### Manual Backup
```bash
# Create backup directory
mkdir -p /var/backups/stemai

# Backup database
mysqldump -u root -p booth-visit-db | gzip > /var/backups/stemai/db-$(date +%Y%m%d-%H%M%S).sql.gz

# Backup application files (excluding node_modules)
cd /var/www
tar -czf /var/backups/stemai/app-$(date +%Y%m%d-%H%M%S).tar.gz \
  --exclude='node_modules' \
  --exclude='.next' \
  stemai.techlympics.my/
```

### Restore from Backup
```bash
# Restore database
gunzip < /var/backups/stemai/db-20231202-120000.sql.gz | mysql -u root -p booth-visit-db

# Restore application files
cd /var/www
tar -xzf /var/backups/stemai/app-20231202-120000.tar.gz
```

## 📈 Performance Monitoring

### PM2 Monitoring
```bash
# Enable PM2 monitoring
pm2 monitor

# View metrics
pm2 status

# Memory and CPU usage
pm2 monit
```

### Nginx Analytics
```bash
# Count requests today
sudo grep $(date +%d/%b/%Y) /var/log/nginx/stemai.techlympics.my-access.log | wc -l

# Top 10 IPs
sudo awk '{print $1}' /var/log/nginx/stemai.techlympics.my-access.log | sort | uniq -c | sort -rn | head -10

# Response codes
sudo awk '{print $9}' /var/log/nginx/stemai.techlympics.my-access.log | sort | uniq -c | sort -rn
```

## 🎯 Important URLs

| Purpose | URL |
|---------|-----|
| Main Site | https://stemai.techlympics.my |
| Admin Login | https://stemai.techlympics.my/login |
| Admin Dashboard | https://stemai.techlympics.my/admin |
| User Management | https://stemai.techlympics.my/admin/users |
| Event Settings | https://stemai.techlympics.my/admin/event |
| Booth Management | https://stemai.techlympics.my/admin/booths |

## 📞 Emergency Procedures

### Complete Application Restart
```bash
# Stop everything
pm2 stop all
sudo systemctl stop nginx

# Start everything
sudo systemctl start nginx
pm2 restart all

# Verify
pm2 status
sudo systemctl status nginx
```

### Rollback to Previous Version
```bash
cd /var/www/stemai.techlympics.my

# Revert to previous commit
git log --oneline -5  # Find commit hash
git checkout <previous-commit-hash>

# Rebuild and restart
npm install
npm run build
pm2 restart stemai-booth
```

## 📝 Notes

- Always test `nginx -t` before reloading Nginx
- Keep `.env` file secure and never commit it
- Monitor disk space regularly with `df -h`
- Check logs when issues occur
- Backup database before major updates
- SSL certificates auto-renew via certbot cron job
