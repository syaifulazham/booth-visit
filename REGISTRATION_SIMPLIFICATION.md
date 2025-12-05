# Registration Form Simplification - Migration Guide

## 🎯 Overview

The registration form has been simplified to only require **3 essential fields**:
1. **Name** (required)
2. **Email** (required) 
3. **Gender** (required)

All other fields are now optional and can be updated later.

---

## 📋 Changes Made

### 1. **Frontend Form** (`src/app/register/page.tsx`)
- ✅ Updated validation to only require name, email, and gender
- ✅ Added email validation (format check)
- ✅ Made phone, state, age, visitorType, and sektor optional
- ✅ Updated form labels to reflect required (*) vs optional fields
- ✅ Added informative message about quick registration

### 2. **Validation Schema** (`src/lib/validators.ts`)
- ✅ Reordered fields: name, email, gender first
- ✅ Made phone optional with `.optional().or(z.literal(''))`
- ✅ Made state optional with `.optional().or(z.literal(''))`
- ✅ Made age optional with `.optional()`
- ✅ Made visitorType optional with `.optional().or(z.literal(''))`
- ✅ Made sektor optional with `.optional().or(z.literal(''))`

### 3. **Database Schema** (`prisma/schema.prisma`)
- ✅ Changed `email` from optional to **required and unique**
- ✅ Changed `phone` from unique to **optional**
- ✅ Made `state`, `age`, `visitorType`, `sektor` optional (nullable)

### 4. **API Route** (`src/app/api/visitors/register/route.ts`)
- ✅ Changed existing visitor check from `phone` to `email`
- ✅ Updated response to return `email` instead of `phone`

---

## 🗄️ Database Migration Required

### **IMPORTANT:** You need to run a database migration to apply schema changes.

### Steps:

#### 1. **Create Migration**
```bash
npx prisma migrate dev --name simplify_visitor_registration
```

This will:
- Make email unique and required
- Make phone optional (remove unique constraint)
- Make state, age, visitorType, sektor nullable

#### 2. **Migration Issues to Handle**

**⚠️ IMPORTANT: Existing Data Considerations**

If you have existing visitors in the database:

**Option A: Fresh Start (Recommended for development)**
```bash
# Drop and recreate database
npx prisma migrate reset

# This will:
# - Drop the database
# - Create it again
# - Run all migrations
# - Seed if you have seed script
```

**Option B: Manual Data Migration (For production)**

If you have existing data with visitors who don't have emails:

1. **Backup your database first:**
```bash
mysqldump -u username -p database_name > backup.sql
```

2. **Update existing visitors to have unique emails:**
```sql
-- Option 1: Set placeholder emails for existing visitors without email
UPDATE Visitor 
SET email = CONCAT('visitor_', id, '@placeholder.com')
WHERE email IS NULL OR email = '';

-- Option 2: Delete visitors without email (if acceptable)
DELETE FROM Visit WHERE visitorId IN (
  SELECT id FROM Visitor WHERE email IS NULL OR email = ''
);
DELETE FROM Visitor WHERE email IS NULL OR email = '';
```

3. **Then run the migration:**
```bash
npx prisma migrate deploy
```

#### 3. **Generate Prisma Client**
```bash
npx prisma generate
```

This updates the TypeScript types to reflect the new schema.

---

## 📝 Field Requirements Summary

### **Required Fields (3)**
| Field | Type | Validation |
|-------|------|-----------|
| Name | String | Min 2 characters |
| Email | String | Valid email format, unique |
| Gender | Enum | 'Lelaki' or 'Perempuan' |

### **Optional Fields (5)**
| Field | Type | Validation |
|-------|------|-----------|
| Phone | String | 10-15 characters (if provided) |
| State | Enum | Valid Malaysian state (if provided) |
| Age | Number | 1-120 (if provided) |
| Visitor Type | Enum | Valid type (if provided) |
| Sektor | Enum | Valid sector (if provided) |

---

## 🎨 UI Changes

### **Before:**
All 8 fields marked as required with red asterisk (*)

### **After:**
- **Name** - ✅ Required (*)
- **Email** - ✅ Required (*)
- **Gender** - ✅ Required (*)
- **Phone** - Optional
- **State** - Optional
- **Age** - Optional
- **Visitor Type** - Optional
- **Sector** - Optional

### **Info Message Added:**
```
ℹ️ Quick Registration: Only name, email, and gender are required.
You can update additional information later.

Pendaftaran Pantas: Hanya nama, emel, dan jantina diperlukan.
Anda boleh mengemas kini maklumat tambahan kemudian.
```

---

## 🔄 User Flow Changes

### **Before:**
1. User must fill 8 fields
2. All validations must pass
3. Registration complete

### **After:**
1. User fills only 3 essential fields (name, email, gender)
2. Optional fields can be skipped
3. Quick registration complete
4. User can update profile later with additional info

---

## 🧪 Testing Checklist

### **Registration Form:**
- [ ] Form loads correctly at `/register`
- [ ] Info message displays at top
- [ ] Required fields show red asterisk (*)
- [ ] Optional fields don't show asterisk
- [ ] Can submit with only name, email, gender
- [ ] Email validation works (invalid format rejected)
- [ ] Gender radio buttons work
- [ ] Optional fields can be empty
- [ ] Optional fields validate correctly when filled
- [ ] Success redirect works

### **Backend:**
- [ ] API accepts minimal data (name, email, gender only)
- [ ] Email uniqueness enforced
- [ ] Existing visitor check by email works
- [ ] Cookie set correctly
- [ ] Optional fields saved when provided
- [ ] Optional fields null/empty when not provided

### **Database:**
- [ ] Migration runs successfully
- [ ] Email column is unique
- [ ] Email column is not nullable
- [ ] Phone column is nullable
- [ ] Phone unique constraint removed
- [ ] State, age, visitorType, sektor are nullable
- [ ] Can insert visitor with minimal data
- [ ] Can insert visitor with all data

---

## 🚀 Deployment Steps

### **Development:**
1. Pull latest code
2. Run `npx prisma migrate dev --name simplify_visitor_registration`
3. Run `npx prisma generate`
4. Restart development server
5. Test registration at `http://localhost:3001/register`

### **Production:**
1. **Backup database first!**
2. Handle existing data (see Migration Issues above)
3. Deploy code changes
4. Run migration: `npx prisma migrate deploy`
5. Generate client: `npx prisma generate`
6. Restart application: `pm2 restart stemai`
7. Test registration

---

## 📊 Benefits

### **For Users:**
- ✅ **Faster registration** - Only 3 fields instead of 8
- ✅ **Less friction** - Quick signup to start visiting booths
- ✅ **Mobile-friendly** - Less typing on mobile devices
- ✅ **Flexibility** - Can add details later

### **For Event:**
- ✅ **Higher conversion** - More visitors will complete registration
- ✅ **Better UX** - Simpler onboarding process
- ✅ **Data quality** - Required fields are truly essential
- ✅ **Progressive profiling** - Can collect more data over time

---

## 🔍 Validation Examples

### **Minimum Valid Registration:**
```json
{
  "name": "Ahmad Ibrahim",
  "email": "ahmad@example.com",
  "gender": "Lelaki"
}
```

### **Full Registration (with optionals):**
```json
{
  "name": "Ahmad Ibrahim",
  "email": "ahmad@example.com",
  "gender": "Lelaki",
  "phone": "0123456789",
  "state": "SELANGOR",
  "age": 25,
  "visitorType": "Pelajar",
  "sektor": "Teknologi"
}
```

### **Invalid Registrations:**
```json
// Missing email
{
  "name": "Ahmad",
  "gender": "Lelaki"
}
// ❌ Error: Email is required

// Invalid email format
{
  "name": "Ahmad",
  "email": "not-an-email",
  "gender": "Lelaki"
}
// ❌ Error: Invalid email format

// Missing gender
{
  "name": "Ahmad",
  "email": "ahmad@example.com"
}
// ❌ Error: Gender is required
```

---

## 🛠️ Troubleshooting

### **Error: Email already exists**
- User has registered before with this email
- System will recognize returning visitor and set cookie

### **Error: Cannot make email unique (existing duplicates)**
- Some visitors have duplicate or missing emails
- Run data cleanup query before migration (see Option B above)

### **Error: Cannot change column to NOT NULL**
- Existing visitors have NULL email values
- Set placeholder emails or delete records without email
- Then run migration again

### **TypeScript errors after migration**
- Run `npx prisma generate` to update types
- Restart TypeScript server in IDE
- Check that @prisma/client is updated

---

## 📞 Support

If you encounter issues during migration:
1. Check database backup is available
2. Review error messages carefully
3. Consult Prisma migration docs: https://www.prisma.io/docs/concepts/components/prisma-migrate
4. Consider running `npx prisma migrate reset` in development

---

## ✅ Completion Checklist

- [ ] Code changes reviewed
- [ ] Database backed up (production)
- [ ] Migration created and tested
- [ ] Prisma client regenerated
- [ ] Development testing complete
- [ ] Production deployment planned
- [ ] Rollback plan prepared
- [ ] Team notified of changes
- [ ] Documentation updated
- [ ] User guide updated (if applicable)

---

## 🎉 Summary

Registration is now **3 simple fields**:
- ✅ **Name**
- ✅ **Email** 
- ✅ **Gender**

Everything else is optional and can be added later!

This provides a better user experience while still collecting essential information for event tracking.
