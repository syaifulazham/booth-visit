# Visitor Tracking Enhancement - Phone & Email

## 🎯 Feature Update

### Date: December 2, 2025
### Status: ✅ Complete

---

## Overview

Enhanced the visitor tracking system to identify returning visitors by phone number and email. The system now recognizes visitors who have previously registered and welcomes them back while maintaining their visit history.

---

## 🔄 How It Works

### Visit Flow

```
1. Visitor scans QR code
   ↓
2. System checks for visitor cookie
   ↓
3. No cookie? → Redirect to registration with booth hashcode
   ↓
4. Visitor enters details including phone number
   ↓
5. System checks if phone number exists in database
   ↓
6a. Phone exists?          6b. New phone?
    → Welcome back!            → Create new visitor
    → Reuse old cookie         → Generate new cookie
    ↓                          ↓
7. Set cookie (2 days)
   ↓
8. Redirect to booth visit page
   ↓
9. Log the visit
   ↓
10. Show personalized welcome with visitor name
```

---

## 📋 Database Changes

### Updated Visitor Model

```prisma
model Visitor {
  id          String   @id @default(cuid())
  name        String
  phone       String   @unique  // ✅ NEW - Required, unique
  email       String?            // ✅ NEW - Optional
  gender      String
  age         Int
  visitorType String
  sektor      String
  cookieId    String   @unique
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  visits      Visit[]
}
```

### Migration Applied
- **File:** `20251202072245_add_phone_email_to_visitor`
- **Changes:**
  - Added `phone` column (VARCHAR, UNIQUE, NOT NULL)
  - Added `email` column (VARCHAR, NULLABLE)
  - Added unique index on `phone`

---

## 🛠️ Code Changes

### 1. Validator Updated

**File:** `src/lib/validators.ts`

```typescript
export const visitorSchema = z.object({
  name: z.string().min(2, 'Name required'),
  phone: z.string().min(10).max(15, 'Invalid phone'), // ✅ NEW
  email: z.string().email().optional().or(z.literal('')), // ✅ NEW
  gender: z.string().min(1, 'Gender required'),
  age: z.coerce.number().min(1).max(150),
  visitorType: z.string().min(1, 'Type required'),
  sektor: z.string().min(1, 'Sector required'),
})
```

### 2. Registration Form Updated

**File:** `src/app/register/page.tsx`

**Added Fields:**
- Phone number input (required)
  - Label: "No. Telefon / Phone Number"
  - Placeholder: "01X-XXXXXXX"
  - Type: tel
  - Required field

- Email input (optional)
  - Label: "Emel / Email (Optional)"
  - Placeholder: "email@example.com"
  - Type: email
  - Optional field

### 3. Registration API Enhanced

**File:** `src/app/api/visitors/register/route.ts`

**Key Logic:**

```typescript
// Check if visitor with this phone already exists
const existingVisitor = await prisma.visitor.findUnique({
  where: { phone: validatedData.phone },
})

if (existingVisitor) {
  // Welcome back! Reuse existing visitor's cookie
  cookieId = existingVisitor.cookieId
  visitor = existingVisitor
} else {
  // New visitor - generate new cookie
  cookieId = generateCookieId()
  visitor = await prisma.visitor.create({
    data: { ...validatedData, cookieId },
  })
}

// Return with isReturning flag
return NextResponse.json({
  success: true,
  isReturning: !!existingVisitor,  // ✅ NEW
  visitor: { id, name, phone, cookieId }
})
```

### 4. Visit Success Page Enhanced

**File:** `src/components/visitor/VisitSuccess.tsx`

**Changes:**
- Shows "Selamat Datang! / Welcome!" instead of just "Success!"
- Displays visitor's name prominently
- Personalized greeting for all visitors

---

## 📱 User Experience

### For New Visitors

1. Scan QR code
2. Fill registration form with phone & email
3. See success: "Thank you for visiting!"
4. Cookie set for 2 days
5. Can visit multiple booths without re-registering

### For Returning Visitors

1. Scan QR code (on different device or after cookie expired)
2. Fill registration form with **same phone number**
3. System recognizes phone number
4. Reuses existing visitor record and cookie
5. All previous visit history maintained
6. See personalized welcome: "Selamat Datang, [Name]!"

---

## 🔐 Security Features

- **Unique Phone Constraint:** Prevents duplicate registrations
- **Cookie-based Identification:** HTTP-only, secure cookies
- **2-Day Expiration:** Cookies auto-expire after 2 days
- **Optional Email:** No spam if visitor doesn't provide email
- **Input Validation:** Phone format validation (10-15 chars)

---

## 📊 Benefits

### For Visitors
✅ No need to remember login credentials
✅ Automatic recognition on return visits
✅ Single registration across multiple devices (via phone)
✅ Personalized welcome experience
✅ Visit history preserved

### For Administrators
✅ Accurate visitor tracking by phone number
✅ Reduced duplicate visitor records
✅ Better data quality for analytics
✅ Contact information for follow-ups
✅ Single source of truth per visitor

---

## 🧪 Testing

### Test Case 1: New Visitor
```bash
1. Visit: http://localhost:3001/visit/booth/[hashcode]
2. Get redirected to registration
3. Fill form:
   - Name: John Doe
   - Phone: 0123456789
   - Email: john@example.com
   - (other fields)
4. Submit
5. ✅ See welcome page with name
6. ✅ Visit logged in database
```

### Test Case 2: Returning Visitor (Same Device)
```bash
1. Visit another booth QR: http://localhost:3001/visit/booth/[other-hashcode]
2. ✅ Cookie exists - no registration needed
3. ✅ Directly log visit
4. ✅ See welcome with name
```

### Test Case 3: Returning Visitor (Different Device/Expired Cookie)
```bash
1. Clear cookies or use different browser
2. Visit: http://localhost:3001/visit/booth/[hashcode]
3. Get redirected to registration
4. Fill form with SAME phone number (0123456789)
5. Submit
6. ✅ System recognizes phone
7. ✅ Reuses existing visitor record
8. ✅ All previous visits still linked
9. ✅ See personalized welcome
```

### Test Case 4: Phone Already Exists (Edge Case)
```bash
1. Try to register with existing phone
2. ✅ System handles gracefully
3. ✅ Returns existing visitor
4. ✅ Sets cookie
5. ✅ No error, smooth experience
```

---

## 📈 Data Flow

### Before (Simple Cookie Only)
```
Visitor → QR Code → Cookie Check → Register → New Cookie → Visit
                                  ↓
                              Lost on cookie expiry
```

### After (Phone + Email Tracking)
```
Visitor → QR Code → Cookie Check
                    ↓
                No Cookie?
                    ↓
                Registration with Phone
                    ↓
            Phone exists in DB?
            ↓               ↓
          YES              NO
            ↓               ↓
    Reuse existing    Create new
    visitor & cookie  visitor
            ↓               ↓
            └───→ Visit ←───┘
                    ↓
            Personalized Welcome
```

---

## 🎨 UI Updates

### Registration Form
**Before:**
- Name
- Gender
- Age
- Visitor Type
- Sector

**After:**
- Name
- **Phone** ⭐ NEW (Required)
- **Email** ⭐ NEW (Optional)
- Gender
- Age
- Visitor Type
- Sector

### Welcome Screen
**Before:**
```
✅ Success!
Thank you for visiting our booth!
```

**After:**
```
✅ Welcome! / Selamat Datang!
[Visitor Name] ⭐ NEW
Thank you for visiting our booth!
```

---

## 🔍 Database Queries

### Check Existing Visitor
```sql
SELECT * FROM Visitor WHERE phone = '0123456789';
```

### Get Visitor History
```sql
SELECT v.*, 
       COUNT(vi.id) as total_visits,
       b.boothName
FROM Visitor v
LEFT JOIN Visit vi ON v.id = vi.visitorId
LEFT JOIN Booth b ON vi.boothId = b.id
WHERE v.phone = '0123456789'
GROUP BY v.id;
```

---

## 📝 API Response Changes

### Registration API Response

**Before:**
```json
{
  "success": true,
  "visitor": {
    "id": "abc123",
    "name": "John Doe",
    "cookieId": "xyz789"
  }
}
```

**After:**
```json
{
  "success": true,
  "isReturning": true,  ⭐ NEW
  "visitor": {
    "id": "abc123",
    "name": "John Doe",
    "phone": "0123456789",  ⭐ NEW
    "cookieId": "xyz789"
  }
}
```

**Status Codes:**
- `201` - New visitor created
- `200` - Returning visitor (phone exists)

---

## ⚠️ Important Notes

### Phone Number Format
- Minimum: 10 characters
- Maximum: 15 characters
- No format enforcement (accepts any digits/symbols)
- Recommend Malaysian format: 01X-XXXXXXX

### Email Handling
- Completely optional
- If provided, basic email validation applies
- Empty string treated as NULL
- Can be used for future communications

### Cookie Behavior
- Cookie ID remains the same for returning visitors
- Cookie duration: 2 days (172,800 seconds)
- Path: `/` (site-wide)
- HTTP-only: true (secure)
- SameSite: lax

### Duplicate Prevention
- Phone number is unique constraint
- Multiple attempts with same phone = same visitor
- Prevents data pollution
- Maintains visit history integrity

---

## 🚀 Future Enhancements

### Phase 1 (Optional)
- [ ] SMS verification for phone numbers
- [ ] Email verification
- [ ] Phone format standardization (e.g., +60XXXXXXXXX)
- [ ] Edit visitor profile

### Phase 2 (Optional)
- [ ] Multiple phone numbers per visitor
- [ ] Family/group registration
- [ ] Loyalty points system
- [ ] Personalized booth recommendations

---

## Conclusion

**Status: ✅ FULLY IMPLEMENTED**

The visitor tracking system now provides:
1. ✅ Phone number-based visitor identification
2. ✅ Optional email collection
3. ✅ Automatic recognition of returning visitors
4. ✅ Preserved visit history across devices
5. ✅ Personalized welcome experience
6. ✅ Better data quality for analytics

All functionality tested and working as expected!

---

**Last Updated:** December 2, 2025  
**Version:** 0.3.0  
**Build Status:** ✅ Passing
