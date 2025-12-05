# STEM & AI Booth Visit Log Book

A web-based log book system for tracking booth visits at MOSTI's STEM & AI showcase event.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MySQL 8+
- npm or yarn

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
Copy `.env.example` to `.env` and configure:
```bash
DATABASE_URL="mysql://user:password@localhost:3306/booth-visit-db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

3. **Run database migrations:**
```bash
npx prisma migrate dev
```

4. **Seed the database:**
```bash
npm run seed
```

Default admin credentials:
- **Email:** admin@mosti.gov.my
- **Password:** admin123

5. **Start development server:**
```bash
npm run dev
```

Visit http://localhost:3000

## 🎯 Quick Demo Setup

**NEW:** This repository includes a **pre-installed demo backup** with 15 Malaysian STEM/AI themed booths!

### Restore Demo Booths (2 Minutes):
1. Complete installation steps above
2. Login to admin panel: http://localhost:3000/login
3. Go to: **Admin → Event Settings** (`/admin/event`)
4. Scroll to **"Restore from Backup"** section
5. Select: `DEMO-backup-sample-booths.json.gz`
6. Click **"Restore"** and confirm
7. Done! 15 demo booths are now loaded ✅

**What's included:**
- 15 professional booths (AI Agriculture, Robotics, Smart Cities, Quantum Computing, etc.)
- Complete booth information (ministry, agency, contact person)
- Unique QR codes for each booth
- Perfect for demos, testing, and presentations

📖 **Full demo guide:** See `INSTALLATION_DEMO.md`

## 📁 Project Structure

```
src/
├── app/              # Next.js 14 App Router
│   ├── (auth)/      # Auth pages
│   ├── admin/       # Admin dashboard & management
│   ├── register/    # Visitor registration
│   ├── visit/       # Booth visit pages
│   └── api/         # API routes
├── components/       # React components
│   ├── ui/          # Base UI components (shadcn/ui)
│   ├── admin/       # Admin-specific components
│   ├── visitor/     # Visitor-facing components
│   └── shared/      # Shared components
├── lib/             # Utilities & configurations
│   ├── db.ts        # Prisma client
│   ├── auth.ts      # NextAuth config
│   ├── utils.ts     # Helper functions
│   └── validators.ts # Zod schemas
└── types/           # TypeScript types

prisma/
├── schema.prisma    # Database schema
├── migrations/      # Migration files
└── seed.ts          # Database seed script
```

## 🔑 Key Features

- ✅ Admin authentication with NextAuth.js
- ✅ Booth registration & QR code generation
- ✅ **Edit booth functionality** (NEW)
- ✅ Visitor registration (bilingual: BM/EN)
- ✅ QR code-based booth visit logging
- ✅ Real-time analytics dashboard
- ✅ **Export reports to CSV** (Visitors, Visits, Booths) (NEW)
- ✅ **PDF export for booth QR codes** (NEW)
- ✅ Duplicate visit prevention
- ✅ Cookie-based visitor persistence (2 days)

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** MySQL with Prisma ORM
- **Auth:** NextAuth.js v5
- **UI:** TailwindCSS + shadcn/ui
- **Forms:** React Hook Form + Zod
- **QR Codes:** qrcode library
- **Charts:** Recharts

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed` - Seed database with initial data
- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx prisma migrate dev` - Create and apply migrations

## 🗃️ Database Schema

### Tables:
- **admins** - Admin users and authentication
- **booths** - Booth information with QR codes
- **visitors** - Visitor registration data
- **visits** - Visit logs (visitor ↔ booth relations)

## 🔐 Security Features

- Bcrypt password hashing
- JWT session tokens
- HTTP-only cookies
- CSRF protection
- Input validation (Zod)
- SQL injection prevention (Prisma ORM)

## 📚 Module URLs

- **Home:** `/`
- **Visitor Registration:** `/register`
- **Booth Visit:** `/visit/booth/[hashcode]`
- **Admin Login:** `/login`
- **Admin Dashboard:** `/admin/dashboard` (with export buttons)
- **Booth Management:** `/admin/booths`
- **Create Booth:** `/admin/booths/new`
- **Edit Booth:** `/admin/booths/[id]/edit` ⭐ NEW
- **View QR Code:** `/admin/booths/[id]/qr` (with PDF download) ⭐ NEW

## 🌐 Deployment

Refer to `blueprint.md` for deployment options:
- Vercel (recommended)
- Self-hosted VPS
- Docker container

## 📖 Documentation

Full project documentation is available in `blueprint.md`

## 🤝 Contributing

This is a project for MOSTI's STEM & AI Showcase event.

## 📄 License

Copyright © 2025 MOSTI

## 📊 Export Features

### CSV Exports
Export comprehensive reports in CSV format:
- **Visitors Report** - All registered visitors with demographics
- **Visits Report** - Complete visit logs with visitor and booth details
- **Booths Report** - All booths with visit counts

Access from: Admin Dashboard → Export Buttons

### PDF Export
Generate professional PDF documents for booths:
- MOSTI branding header
- QR code with booth details
- Bilingual instructions
- Printable A4 format

Access from: Booth Management → QR Code → PDF Button

---

**Version:** 0.3.0  
**Last Updated:** December 5, 2025  
**Status:** Registration Simplified + Demo Backup Included ✅
