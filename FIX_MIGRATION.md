# Fix Failed Migration on Server

## Problem
The migration `20251205085800_make_email_unique_and_optional_fields` failed because:
- Existing visitors in the database don't have unique emails
- Some visitors have NULL or duplicate emails

## Solution Steps

### Option 1: Fix Data Then Apply Migration (Recommended)

**Step 1: Connect to your server**
```bash
ssh your-server
cd ~/apps/booth-visit
```

**Step 2: Check for problematic data**
```bash
# Connect to MySQL
mysql -u root -p booth-visit-db

# Check for visitors without email or with duplicate emails
SELECT email, COUNT(*) as count 
FROM Visitor 
GROUP BY email 
HAVING count > 1 OR email IS NULL OR email = '';

# Check total visitors
SELECT COUNT(*) FROM Visitor;
```

**Step 3: Fix the data**

**Option A: If you can delete existing visitors (fresh start)**
```sql
-- Delete all visits first (foreign key constraint)
DELETE FROM Visit;

-- Delete all visitors
DELETE FROM Visitor;

-- Exit MySQL
exit;
```

**Option B: If you need to keep the data**
```sql
-- Update visitors without email to use a placeholder
UPDATE Visitor 
SET email = CONCAT('visitor_', id, '@placeholder.local')
WHERE email IS NULL OR email = '';

-- For duplicate emails, add a suffix
SET @row_number = 0;
UPDATE Visitor v1
JOIN (
  SELECT id, email, 
    (@row_number:=@row_number + 1) as rownum
  FROM Visitor
  WHERE email IN (
    SELECT email 
    FROM Visitor 
    GROUP BY email 
    HAVING COUNT(*) > 1
  )
  ORDER BY id
) v2 ON v1.id = v2.id
SET v1.email = CONCAT(v2.email, '_', v2.rownum)
WHERE v2.rownum > 1;

-- Exit MySQL
exit;
```

**Step 4: Roll back the failed migration**
```bash
npx prisma migrate resolve --rolled-back "20251205085800_make_email_unique_and_optional_fields"
```

**Step 5: Apply the migration again**
```bash
npx prisma migrate deploy
```

**Step 6: Generate Prisma Client**
```bash
npx prisma generate
```

**Step 7: Rebuild and restart**
```bash
npm run build
pm2 restart stemai
```

---

### Option 2: Reset Database (If No Important Data)

**DANGER: This deletes all data!**

```bash
# On server
cd ~/apps/booth-visit

# Reset the database (drops everything and reapplies all migrations)
npx prisma migrate reset --force

# Generate client
npx prisma generate

# Rebuild
npm run build

# Restart
pm2 restart stemai
```

---

## Verification

After fixing, verify the migration status:
```bash
npx prisma migrate status
```

Should show:
```
Database schema is up to date!
```

---

## Quick Commands Reference

### Check Migration Status
```bash
npx prisma migrate status
```

### View Current Database Schema
```bash
npx prisma db pull
```

### Mark Migration as Applied (if you fixed DB manually)
```bash
npx prisma migrate resolve --applied "20251205085800_make_email_unique_and_optional_fields"
```

### Mark Migration as Rolled Back
```bash
npx prisma migrate resolve --rolled-back "20251205085800_make_email_unique_and_optional_fields"
```

---

## Common Issues

### "Duplicate entry for email"
- Some visitors have the same email
- Solution: Use Option B in Step 3 to add unique suffixes

### "Column 'email' cannot be null"
- Some visitors have NULL email
- Solution: Use Option B in Step 3 to set placeholder emails

### "Phone unique constraint error"
- The migration tries to drop phone unique constraint but fails
- Solution: Check if phone constraint exists first

---

## MySQL Commands Cheat Sheet

```bash
# Connect to MySQL
mysql -u root -p booth-visit-db

# Show all tables
SHOW TABLES;

# Describe Visitor table
DESCRIBE Visitor;

# Count visitors
SELECT COUNT(*) FROM Visitor;

# Show visitors without email
SELECT * FROM Visitor WHERE email IS NULL OR email = '';

# Show duplicate emails
SELECT email, COUNT(*) FROM Visitor GROUP BY email HAVING COUNT(*) > 1;

# Exit MySQL
exit;
```

---

## Recommended Approach

**For Production Server with Data:**
1. Backup database first!
2. Use Option 1, Step 3, Option B (fix data)
3. Roll back migration
4. Apply migration again
5. Verify and rebuild

**For Development/Testing Server:**
1. Use Option 2 (reset database)
2. Much faster and cleaner

---

## After Success

Test the application:
1. Register new visitor at `/register`
2. Try to edit profile at `/edit`
3. Visit some booths
4. Check everything works

---

## Need Help?

If you encounter other errors, check:
- MySQL error logs: `sudo tail -f /var/log/mysql/error.log`
- Application logs: `pm2 logs stemai`
- Database connection: Verify `.env` has correct `DATABASE_URL`
