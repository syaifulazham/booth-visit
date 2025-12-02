# NextAuth UntrustedHost Error Fix

## Error Message
```
[auth][error] UntrustedHost: Host must be trusted. URL was: http://localhost:3001/api/auth/session
```

## Root Cause
NextAuth v5 requires explicit host trust configuration. The application was running without the `trustHost` option enabled.

## Solution Applied

### 1. ✅ Code Fix (Already Applied)
Updated `src/lib/auth.ts` to include `trustHost: true`:

```typescript
export const { handlers, signIn, signOut, auth } = NextAuth({
  // ... other config
  trustHost: true, // ← Added this line
})
```

### 2. ⚠️ Environment Variable (Action Required on Server)

Add this to your production `.env` file:

```env
AUTH_TRUST_HOST="true"
```

## Quick Fix on Production Server

```bash
# 1. Navigate to application directory
cd /var/www/stemai.techlympics.my

# 2. Pull latest code changes
git pull origin main

# 3. Update .env file
nano .env
```

Add or verify these lines in `.env`:
```env
DATABASE_URL="mysql://booth_user:your_password@localhost:3306/booth-visit-db"
NEXTAUTH_URL="https://stemai.techlympics.my"
NEXTAUTH_SECRET="your-generated-secret"
AUTH_TRUST_HOST="true"
NODE_ENV="production"
```

```bash
# 4. Rebuild the application
npm run build

# 5. Restart PM2
pm2 restart stemai-booth

# 6. Check logs
pm2 logs stemai-booth --lines 50
```

## Verify Fix

### Check if error is gone:
```bash
# Watch logs in real-time
pm2 logs stemai-booth

# Should NOT see UntrustedHost errors anymore
```

### Test the application:
```bash
# Test health endpoint
curl http://localhost:3001/health

# Test from external
curl https://stemai.techlympics.my/health
```

### Test admin login:
```bash
# Open in browser
https://stemai.techlympics.my/login

# Try logging in with admin credentials
# Should work without UntrustedHost errors
```

## Alternative Fix (If Still Having Issues)

If you're still seeing errors after the above steps:

### Option 1: Explicitly Set Trusted Hosts

Update `src/lib/auth.ts`:

```typescript
export const { handlers, signIn, signOut, auth } = NextAuth({
  // ... other config
  trustHost: true,
  // OR use specific hosts:
  // trustHost: ['stemai.techlympics.my', 'localhost:3001'],
})
```

### Option 2: Use AUTH_URL Environment Variable

Instead of `NEXTAUTH_URL`, use `AUTH_URL`:

```env
# In .env file
AUTH_URL="https://stemai.techlympics.my"
AUTH_SECRET="your-secret"
AUTH_TRUST_HOST="true"
```

## What Changed

### Files Modified:
- ✅ `src/lib/auth.ts` - Added `trustHost: true`
- ✅ `.env.example` - Added `AUTH_TRUST_HOST="true"`
- ✅ `DEPLOYMENT.md` - Updated env configuration
- ✅ `BUILD_FIX_GUIDE.md` - Updated env configuration

### Why This Error Occurred:
NextAuth v5 (Auth.js) has stricter security by default. It requires explicit trust configuration to prevent host header injection attacks. The `trustHost: true` option tells NextAuth to trust the request headers.

### Security Note:
Setting `trustHost: true` is safe when:
- ✅ You're behind a reverse proxy (Nginx)
- ✅ Your Nginx is properly configured
- ✅ You're using HTTPS in production
- ✅ Your server firewall is configured

All of these are met in your deployment setup with Nginx + SSL.

## Troubleshooting

### Still seeing errors?

1. **Check environment variables are loaded:**
   ```bash
   pm2 describe stemai-booth | grep -A 10 "env:"
   ```

2. **Verify .env file exists and is readable:**
   ```bash
   cat /var/www/stemai.techlympics.my/.env | grep AUTH
   ```

3. **Check build includes the fix:**
   ```bash
   grep "trustHost" /var/www/stemai.techlympics.my/src/lib/auth.ts
   ```

4. **Restart PM2 completely:**
   ```bash
   pm2 delete stemai-booth
   pm2 start npm --name "stemai-booth" -- start -- -p 3001
   pm2 save
   ```

5. **Check Nginx proxy headers:**
   Your nginx config already has the correct headers:
   ```nginx
   proxy_set_header Host $host;
   proxy_set_header X-Real-IP $remote_addr;
   proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
   proxy_set_header X-Forwarded-Proto $scheme;
   ```

## Expected Result

After applying the fix:
- ✅ No more `UntrustedHost` errors in logs
- ✅ Admin login works properly
- ✅ Authentication sessions persist
- ✅ API routes work correctly
- ✅ Middleware functions properly

## Timeline

1. **Pull latest code** - Contains trustHost fix
2. **Update .env** - Add AUTH_TRUST_HOST
3. **Rebuild** - Include code changes
4. **Restart** - Apply new configuration
5. **Test** - Verify no errors

Total time: ~5 minutes

## Quick Commands Summary

```bash
cd /var/www/stemai.techlympics.my
git pull origin main
nano .env  # Add AUTH_TRUST_HOST="true"
npm run build
pm2 restart stemai-booth
pm2 logs stemai-booth
```

Done! The UntrustedHost error should be resolved. 🎉
