# Build Fix Guide

## Issues Fixed

### 1. ✅ Dynamic Server Usage Errors
**Problem:** API routes were being statically rendered during build, causing errors with `headers()` and `cookies()`.

**Solution:** Added `export const dynamic = 'force-dynamic'` to all API route files.

**Files Updated:**
- All files in `src/app/api/**/**/route.ts` now have dynamic export

### 2. ✅ Missing Suspense Boundary
**Problem:** `/register` page used `useSearchParams()` without Suspense boundary.

**Solution:** Wrapped the component using `useSearchParams()` in a Suspense boundary.

**File Updated:**
- `src/app/register/page.tsx`

### 3. ⚠️ Database Not Created
**Problem:** Database `booth-visit-db` doesn't exist on MySQL server.

**Solution:** Create the database before running migrations.

---

## Pre-Deployment Database Setup

### On Your Production Server

```bash
# 1. Connect to MySQL
mysql -u root -p

# 2. Create the database
CREATE DATABASE IF NOT EXISTS `booth-visit-db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 3. Create a dedicated user (recommended)
CREATE USER IF NOT EXISTS 'booth_user'@'localhost' IDENTIFIED BY 'your_secure_password_here';

# 4. Grant privileges
GRANT ALL PRIVILEGES ON `booth-visit-db`.* TO 'booth_user'@'localhost';
FLUSH PRIVILEGES;

# 5. Verify database created
SHOW DATABASES;

# 6. Exit MySQL
EXIT;
```

### Update .env File

After creating the database, update your `.env` file:

```env
# MySQL Database Connection
DATABASE_URL="mysql://booth_user:your_secure_password_here@localhost:3306/booth-visit-db"

# NextAuth Configuration
NEXTAUTH_URL="https://stemai.techlympics.my"
NEXTAUTH_SECRET="generate-a-long-random-string-here"
AUTH_TRUST_HOST="true"

# Environment
NODE_ENV="production"
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

---

## Deployment Steps (Updated)

### Step 1: Prepare Server
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install MySQL if not installed
sudo apt install mysql-server -y

# Secure MySQL installation
sudo mysql_secure_installation
```

### Step 2: Create Database
```bash
# Run the MySQL commands above to create database and user
mysql -u root -p < create_database.sql
```

Create `create_database.sql`:
```sql
CREATE DATABASE IF NOT EXISTS `booth-visit-db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'booth_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON `booth-visit-db`.* TO 'booth_user'@'localhost';
FLUSH PRIVILEGES;
```

### Step 3: Setup Application
```bash
# Navigate to app directory
cd /var/www/stemai.techlympics.my

# Create .env file
nano .env
# (paste your environment variables)

# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Run migrations to create tables
npx prisma migrate deploy

# Create initial admin user (optional)
npx ts-node scripts/create-admin.ts
```

### Step 4: Build Application
```bash
# Build the Next.js application
npm run build

# This should now complete without errors
```

### Step 5: Start with PM2
```bash
# Start application
pm2 start npm --name "stemai-booth" -- start -- -p 3001

# Save PM2 process list
pm2 save

# Setup startup script
pm2 startup
```

### Step 6: Configure Nginx & SSL
```bash
# Copy nginx config
sudo cp nginx-stemai.conf /etc/nginx/sites-available/stemai.techlympics.my

# Enable site
sudo ln -s /etc/nginx/sites-available/stemai.techlympics.my /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Setup SSL
sudo certbot --nginx -d stemai.techlympics.my -d www.stemai.techlympics.my
```

---

## Verification

### Test Build Locally
```bash
# On your development machine
npm run build

# Should complete successfully without errors
```

### Test on Production
```bash
# After deployment
pm2 logs stemai-booth

# Check if application started successfully
curl http://localhost:3001/health

# Check HTTPS
curl https://stemai.techlympics.my/health
```

---

## Troubleshooting

### Build Still Fails with Dynamic Errors

**Check if all API routes have dynamic export:**
```bash
grep -r "export const dynamic" src/app/api --include="*.ts" | wc -l
# Should show multiple results
```

**Manually verify each route has:**
```typescript
export const dynamic = 'force-dynamic'
```

### Database Connection Issues

**Test database connection:**
```bash
mysql -u booth_user -p booth-visit-db -e "SELECT 1;"
```

**Check DATABASE_URL format:**
```
mysql://username:password@host:port/database
```

**Common issues:**
- Wrong password
- User doesn't have privileges
- Database doesn't exist
- MySQL not running: `sudo systemctl status mysql`

### Prisma Migration Errors

**Reset and migrate:**
```bash
# Backup first if you have data!
mysqldump -u booth_user -p booth-visit-db > backup.sql

# Reset
npx prisma migrate reset

# Deploy migrations
npx prisma migrate deploy
```

### PM2 Won't Start

**Check logs:**
```bash
pm2 logs stemai-booth --lines 100
```

**Common issues:**
- Port 3001 already in use: `sudo lsof -i :3001`
- Missing .env file
- Database connection failed
- Build not completed

---

## Create Admin User Script

Create `scripts/create-admin.ts`:

```typescript
import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = process.argv[2] || 'admin@mosti.gov.my'
  const password = process.argv[3] || 'admin123'
  const name = process.argv[4] || 'Admin User'

  const hashedPassword = await bcrypt.hash(password, 10)

  const admin = await prisma.admin.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: 'super_admin',
    },
  })

  console.log('Admin user created:', admin.email)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

**Run it:**
```bash
npx ts-node scripts/create-admin.ts admin@example.com SecurePassword123 "Admin Name"
```

---

## Quick Fix Commands

### If Build Fails Again

```bash
# 1. Clean build cache
rm -rf .next
rm -rf node_modules/.cache

# 2. Reinstall dependencies
rm -rf node_modules
npm install

# 3. Generate Prisma client
npx prisma generate

# 4. Build again
npm run build
```

### If Database Issues

```bash
# 1. Check MySQL is running
sudo systemctl status mysql

# 2. Test connection
mysql -u booth_user -p booth-visit-db

# 3. Verify tables exist
mysql -u booth_user -p booth-visit-db -e "SHOW TABLES;"

# 4. Run migrations
npx prisma migrate deploy
```

### If Application Won't Start

```bash
# 1. Check PM2 status
pm2 status

# 2. View logs
pm2 logs stemai-booth --lines 50

# 3. Restart
pm2 restart stemai-booth

# 4. If still fails, delete and recreate
pm2 delete stemai-booth
pm2 start npm --name "stemai-booth" -- start -- -p 3001
pm2 save
```

---

## Summary of Changes

✅ **All API routes** now have `export const dynamic = 'force-dynamic'`
✅ **Register page** wrapped in Suspense boundary
✅ **Database setup** steps added
✅ **Environment variables** properly configured
✅ **Build process** should now complete successfully

---

## Next Steps

1. ✅ Create database on production server
2. ✅ Update .env with correct DATABASE_URL
3. ✅ Run migrations: `npx prisma migrate deploy`
4. ✅ Build application: `npm run build`
5. ✅ Start with PM2
6. ✅ Configure Nginx and SSL
7. ✅ Test the application

Your application should now build and deploy successfully! 🚀
