# STEM & AI Booth Visit Log Book - Project Blueprint

## Project Overview

A web-based log book system for tracking booth visits at MOSTI's STEM & AI showcase event. The system enables booth registration, visitor tracking via QR codes, and comprehensive analytics dashboard.

---

## Technology Stack

### Recommended Framework: **Next.js 14+ (App Router)**
**Rationale:**
- Built-in API routes for backend functionality
- Server-side rendering for better SEO and performance
- Edge runtime support for fast global response times
- TypeScript support for type safety
- Easy deployment (Vercel, self-hosted)

### Core Technologies
- **Frontend:** Next.js 14+ (React 18+), TailwindCSS, shadcn/ui
- **Backend:** Next.js API Routes (App Router)
- **ORM:** Prisma (MySQL)
- **Authentication:** NextAuth.js v5 (Auth.js)
- **QR Code Generation:** qrcode.react or qr-code-styling
- **PDF Generation:** jsPDF or react-pdf
- **State Management:** React Context / Zustand (for complex state)
- **Form Handling:** React Hook Form + Zod validation
- **Charts/Analytics:** Recharts or Chart.js

---

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Client Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Admin Panel  │  │   Visitor    │  │    Booth     │  │
│  │  Dashboard   │  │ Registration │  │  Visit Page  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────┐
│                   Next.js App Router                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │     Pages    │  │  API Routes  │  │  Middleware  │  │
│  │  (RSC/SSR)   │  │   (Backend)  │  │    (Auth)    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────┐
│                    Prisma ORM Layer                      │
│              (Query Builder & Migration)                 │
└─────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────┐
│                    MySQL Database                        │
│         (Booth, Visitor, Visit Logs, Admin)             │
└─────────────────────────────────────────────────────────┘
```

---

## Database Schema

### Tables Structure

#### 1. **admins**
```prisma
model Admin {
  id            String   @id @default(cuid())
  email         String   @unique
  password      String   // Hashed with bcrypt
  name          String
  role          String   @default("admin") // admin, super_admin
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

#### 2. **booths**
```prisma
model Booth {
  id                String   @id @default(cuid())
  boothName         String
  ministry          String
  agency            String
  abbreviationName  String
  picName           String?  // Person In Charge (Optional)
  picPhone          String?  // Optional
  picEmail          String?  // Optional
  hashcode          String   @unique // For QR code URL
  qrCodeGenerated   Boolean  @default(false)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  visits            Visit[]
}
```

#### 3. **visitors**
```prisma
model Visitor {
  id            String   @id @default(cuid())
  name          String
  gender        String   // Lelaki, Perempuan
  age           Int
  visitorType   String   // Awam, Kakitangan Kerajaan, etc.
  sektor        String   // pertanian, penternakan, etc.
  cookieId      String   @unique // For cookie identification
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  visits        Visit[]
}
```

#### 4. **visits**
```prisma
model Visit {
  id          String   @id @default(cuid())
  visitorId   String
  boothId     String
  visitedAt   DateTime @default(now())
  ipAddress   String?
  userAgent   String?
  
  visitor     Visitor  @relation(fields: [visitorId], references: [id], onDelete: Cascade)
  booth       Booth    @relation(fields: [boothId], references: [id], onDelete: Cascade)
  
  @@unique([visitorId, boothId]) // Prevent duplicate visits
  @@index([boothId])
  @@index([visitorId])
  @@index([visitedAt])
}
```

---

## Module Specifications

### Module 1: Admin Authentication

**Route:** `/admin/login`

**Features:**
- Secure login with email and password
- Session management using NextAuth.js
- Role-based access control
- Password hashing with bcrypt
- CSRF protection

**UI Components:**
- Login form with email and password fields
- Remember me checkbox
- Error handling and validation messages
- Responsive design

**API Endpoints:**
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/session` - Check session status

---

### Module 2: Booth Registration & Management

**Route:** `/admin/booths`

**Features:**
- Create, Read, Update, Delete (CRUD) booths
- Auto-generate unique hashcode for each booth
- Generate QR code with booth visit URL
- Export booth details with QR code as PDF
- Data table with sorting, filtering, and pagination
- Database IDE-like interface

**UI Components (Database IDE Style):**
```
┌─────────────────────────────────────────────────────────┐
│ [+ New Booth]  [🔄 Refresh]  [📥 Export All]            │
├─────────────────────────────────────────────────────────┤
│ 🔍 Search: [___________________]  Filters: [Ministry ▼] │
├──┬─────────────────┬──────────┬─────────┬──────────────┤
│☐ │ Booth Name      │ Ministry │ Agency  │ Actions      │
├──┼─────────────────┼──────────┼─────────┼──────────────┤
│☐ │ AI Innovation   │ MOSTI    │ MyDigit │ [📝][📄][🗑️]│
│☐ │ Robotics Lab    │ MOSTI    │ SIRIM   │ [📝][📄][🗑️]│
├──┴─────────────────┴──────────┴─────────┴──────────────┤
│ Showing 1-10 of 45 booths          [< 1 2 3 4 5 >]     │
└─────────────────────────────────────────────────────────┘

Legend: [📝] Edit  [📄] Generate PDF/QR  [🗑️] Delete
```

**Booth Form Fields:**
- Booth Name (required)
- Ministry (dropdown or autocomplete)
- Agency (required)
- Abbreviation Name (optional)
- PIC Name (optional)
- PIC Phone (optional, format validation if provided)
- PIC Email (optional, email validation if provided)
- Hashcode (auto-generated, read-only)

**PDF Generation:**
- Include booth details
- QR code pointing to `/visit/booth/[hashcode]`
- MOSTI branding and event information
- Printable A4 format

**API Endpoints:**
- `GET /api/admin/booths` - List all booths
- `POST /api/admin/booths` - Create new booth
- `PUT /api/admin/booths/[id]` - Update booth
- `DELETE /api/admin/booths/[id]` - Delete booth
- `GET /api/admin/booths/[id]/pdf` - Generate PDF with QR code

---

### Module 3: Admin Dashboard & Analytics

**Route:** `/admin/dashboard`

**Features:**
- Real-time visitor statistics
- Booth visit rankings
- Demographic breakdowns
- Time-series charts
- Export reports (CSV, PDF)

**Dashboard Sections:**

**3.1. Overview Cards**
```
┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│ Total Visitors│ │ Total Booths  │ │  Total Visits │
│     1,234     │ │      45       │ │     5,678     │
└───────────────┘ └───────────────┘ └───────────────┘
```

**3.2. Top Booths by Visits**
- Bar chart or table showing most visited booths
- Sortable by visit count
- Filter by date range

**3.3. Visitor Demographics**
- Pie charts for:
  - Gender distribution
  - Visitor type breakdown
  - Age group distribution
  - Sector distribution
- Real-time updates

**3.4. Visit Timeline**
- Line chart showing visits over time (hourly/daily)
- Compare booth performance

**3.5. Recent Activities**
- Live feed of recent booth visits
- Visitor name, booth name, timestamp

**API Endpoints:**
- `GET /api/admin/stats/overview` - Overall statistics
- `GET /api/admin/stats/booths` - Booth-specific stats
- `GET /api/admin/stats/visitors` - Visitor demographics
- `GET /api/admin/stats/timeline` - Time-series data
- `GET /api/admin/reports/export` - Export reports

---

### Module 4: Visitor Registration

**Route:** `/register`

**Features:**
- Professional, user-friendly registration form
- Form validation with clear error messages
- Cookie-based persistence (2 days)
- Responsive mobile-first design
- Multi-language support (Bahasa Malaysia + English)

**UI Design (Professional Style):**
```
┌─────────────────────────────────────────────────────────┐
│              🏢 MOSTI STEM & AI Showcase                 │
│            Pendaftaran Pelawat / Visitor Registration    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Maklumat Peribadi / Personal Information               │
│                                                          │
│  Nama Penuh / Full Name *                               │
│  [_____________________________________________]         │
│                                                          │
│  Jantina / Gender *                                     │
│  ( ) Lelaki / Male    ( ) Perempuan / Female            │
│                                                          │
│  Umur / Age *                                           │
│  [____] tahun / years old                               │
│                                                          │
│  Jenis Pelawat / Visitor Type *                         │
│  [Sila Pilih / Please Select ▼]                         │
│   - Awam / Public                                       │
│   - Kakitangan Kerajaan / Government Employee           │
│   - Kakitangan Swasta / Private Employee                │
│   - Pelajar / Student                                   │
│   - Pensyarah/Guru / Lecturer/Teacher                   │
│   - Lain-lain / Others                                  │
│                                                          │
│  Sektor / Sector *                                      │
│  [Sila Pilih / Please Select ▼]                         │
│   - Pertanian / Agriculture                             │
│   - Penternakan / Livestock                             │
│   - Perindustrian / Industrial                          │
│   - Automotif / Automotive                              │
│   - Teknologi / Technology                              │
│   - Pendidikan / Education                              │
│   - Kesihatan / Healthcare                              │
│   - Lain-lain / Others                                  │
│                                                          │
│  [✓] Saya bersetuju dengan terma dan syarat             │
│      I agree to the terms and conditions                │
│                                                          │
│            [ Daftar / Register ]                        │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**Form Validation:**
- All fields marked with * are required
- Age must be between 1-120
- Client-side and server-side validation
- Bilingual error messages

**Cookie Management:**
- Store visitor ID in cookie (httpOnly, secure)
- Expire after 2 days
- Include visitor basic info for quick access

**API Endpoints:**
- `POST /api/visitors/register` - Register new visitor
- `GET /api/visitors/check` - Check if visitor is registered

---

### Module 5: Booth Visit Logging

**Route:** `/visit/booth/[hashcode]`

**Flow:**
1. Visitor scans QR code at booth
2. System checks if visitor is registered (via cookie)
3. If not registered → redirect to `/register?redirect=/visit/booth/[hashcode]`
4. If registered → log the visit and show success page
5. Prevent duplicate visits (same visitor to same booth)

**Success Page:**
```
┌─────────────────────────────────────────────────────────┐
│                     ✓ Berjaya!                           │
│                    Success!                              │
│                                                          │
│  Terima kasih kerana melawat gerai kami!                │
│  Thank you for visiting our booth!                      │
│                                                          │
│  Gerai / Booth: AI Innovation Hub                       │
│  Agensi / Agency: MyDigital (MOSTI)                     │
│                                                          │
│  ─────────────────────────────────────                  │
│                                                          │
│  Lawati gerai lain untuk pengalaman yang lebih hebat!   │
│  Visit other booths for more amazing experiences!       │
│                                                          │
│  [ Kembali ke Senarai Gerai / Back to Booth List ]      │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**Error Handling:**
- Invalid hashcode → Show 404 page
- Already visited → Show "Already visited" message
- Network errors → Show retry option

**API Endpoints:**
- `GET /api/booths/[hashcode]` - Get booth details
- `POST /api/visits/log` - Log booth visit

---

## Project Structure

```
stem-ai-booth-logbook/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login/
│   │   │       └── page.tsx
│   │   ├── admin/
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   └── booths/
│   │   │       ├── page.tsx
│   │   │       ├── new/
│   │   │       │   └── page.tsx
│   │   │       └── [id]/
│   │   │           ├── edit/
│   │   │           │   └── page.tsx
│   │   │           └── pdf/
│   │   │               └── route.ts
│   │   ├── register/
│   │   │   └── page.tsx
│   │   ├── visit/
│   │   │   └── booth/
│   │   │       └── [hashcode]/
│   │   │           └── page.tsx
│   │   └── api/
│   │       ├── auth/
│   │       │   └── [...nextauth]/
│   │       │       └── route.ts
│   │       ├── admin/
│   │       │   ├── booths/
│   │       │   │   ├── route.ts
│   │       │   │   └── [id]/
│   │       │   │       └── route.ts
│   │       │   └── stats/
│   │       │       ├── overview/
│   │       │       │   └── route.ts
│   │       │       ├── booths/
│   │       │       │   └── route.ts
│   │       │       └── visitors/
│   │       │           └── route.ts
│   │       ├── visitors/
│   │       │   ├── register/
│   │       │   │   └── route.ts
│   │       │   └── check/
│   │       │       └── route.ts
│   │       └── visits/
│   │           └── log/
│   │               └── route.ts
│   ├── components/
│   │   ├── ui/ (shadcn components)
│   │   ├── admin/
│   │   │   ├── BoothTable.tsx
│   │   │   ├── BoothForm.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   └── StatsCards.tsx
│   │   ├── visitor/
│   │   │   ├── RegistrationForm.tsx
│   │   │   └── VisitSuccess.tsx
│   │   └── shared/
│   │       ├── Header.tsx
│   │       ├── Footer.tsx
│   │       └── Loading.tsx
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── db.ts (Prisma client)
│   │   ├── utils.ts
│   │   ├── validators.ts (Zod schemas)
│   │   ├── qrcode-generator.ts
│   │   └── pdf-generator.ts
│   ├── types/
│   │   └── index.ts
│   └── middleware.ts
├── public/
│   ├── images/
│   └── fonts/
├── .env
├── .env.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## Security Considerations

### Authentication & Authorization
- Admin passwords hashed with bcrypt (10+ rounds)
- JWT tokens for session management
- HTTP-only cookies for token storage
- CSRF protection enabled
- Role-based access control (RBAC)

### Data Protection
- Input validation on both client and server
- SQL injection prevention (Prisma ORM)
- XSS protection (React auto-escaping)
- Rate limiting on API endpoints
- Secure cookie settings (httpOnly, secure, sameSite)

### API Security
- Authentication middleware for admin routes
- Request validation using Zod
- Error handling without exposing sensitive info
- CORS configuration for production

---

## Environment Variables

```env
# Database
DATABASE_URL="mysql://user:password@localhost:3306/stem_ai_booth"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-here"

# App Config
NEXT_PUBLIC_APP_URL="http://localhost:3000"
COOKIE_MAX_AGE=172800 # 2 days in seconds

# Optional: Email Service (for notifications)
SMTP_HOST=""
SMTP_PORT=""
SMTP_USER=""
SMTP_PASSWORD=""
```

---

## Development Phases

### Phase 1: Setup & Foundation (Week 1)
- [ ] Initialize Next.js project with TypeScript
- [ ] Setup Prisma with MySQL
- [ ] Configure authentication (NextAuth.js)
- [ ] Create database schema and run migrations
- [ ] Setup TailwindCSS and shadcn/ui
- [ ] Create basic project structure

### Phase 2: Admin Module (Week 2)
- [ ] Build admin login page
- [ ] Create admin dashboard layout
- [ ] Implement booth CRUD operations
- [ ] Design database IDE-style booth table
- [ ] Implement QR code generation
- [ ] Create PDF export functionality

### Phase 3: Visitor Module (Week 3)
- [ ] Design visitor registration form
- [ ] Implement form validation
- [ ] Create cookie management system
- [ ] Build booth visit logging
- [ ] Design visit success page
- [ ] Handle edge cases and errors

### Phase 4: Analytics & Dashboard (Week 4)
- [ ] Build analytics dashboard
- [ ] Implement charts and visualizations
- [ ] Create real-time statistics
- [ ] Add export functionality (CSV, PDF)
- [ ] Optimize database queries
- [ ] Add caching for performance

### Phase 5: Testing & Deployment (Week 5)
- [ ] Write unit tests
- [ ] Perform integration testing
- [ ] User acceptance testing (UAT)
- [ ] Performance optimization
- [ ] Security audit
- [ ] Deploy to production
- [ ] Setup monitoring and logging

---

## API Documentation Summary

### Public APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/visitors/register` | Register new visitor |
| GET | `/api/visitors/check` | Check visitor registration |
| GET | `/api/booths/[hashcode]` | Get booth details |
| POST | `/api/visits/log` | Log booth visit |

### Admin APIs (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Admin login |
| GET | `/api/admin/booths` | List all booths |
| POST | `/api/admin/booths` | Create booth |
| PUT | `/api/admin/booths/[id]` | Update booth |
| DELETE | `/api/admin/booths/[id]` | Delete booth |
| GET | `/api/admin/booths/[id]/pdf` | Generate PDF with QR |
| GET | `/api/admin/stats/overview` | Overall stats |
| GET | `/api/admin/stats/booths` | Booth-specific stats |
| GET | `/api/admin/stats/visitors` | Visitor demographics |
| GET | `/api/admin/stats/timeline` | Time-series data |
| GET | `/api/admin/reports/export` | Export reports |

---

## Deployment Recommendations

### Option 1: Vercel (Recommended)
- **Pros:** Zero config, automatic HTTPS, edge functions, built for Next.js
- **Cons:** Need external MySQL database
- **Database:** PlanetScale, Railway, or DigitalOcean Managed MySQL

### Option 2: Self-Hosted (VPS)
- **Platform:** DigitalOcean, AWS EC2, or local server
- **Stack:** Ubuntu + Nginx + PM2 + MySQL
- **Pros:** Full control, single server for app and database
- **Cons:** Requires DevOps knowledge

### Option 3: Docker Container
- **Setup:** Dockerfile + docker-compose
- **Pros:** Consistent environment, easy replication
- **Cons:** Requires Docker knowledge

---

## Performance Optimization

### Database
- Index on frequently queried columns (hashcode, cookieId, visitedAt)
- Use connection pooling
- Implement query result caching
- Regular database maintenance

### Frontend
- Image optimization (Next.js Image component)
- Code splitting and lazy loading
- Server-side rendering for initial load
- CDN for static assets

### Backend
- API response caching (Redis optional)
- Rate limiting to prevent abuse
- Efficient database queries (avoid N+1)
- Background jobs for heavy tasks

---

## Monitoring & Analytics

### Application Monitoring
- Error tracking (Sentry)
- Performance monitoring (Vercel Analytics)
- Uptime monitoring (UptimeRobot)

### Business Analytics
- Track booth popularity trends
- Monitor peak visit times
- Analyze visitor demographics
- Generate monthly reports

---

## Future Enhancements (Post-MVP)

1. **Mobile App:** Native iOS/Android app for better offline support
2. **Real-time Dashboard:** WebSocket for live updates
3. **Gamification:** Badges/rewards for visiting multiple booths
4. **Feedback System:** Allow visitors to rate booths
5. **Multi-event Support:** Manage multiple events simultaneously
6. **Email Notifications:** Send summary to booth PICs
7. **Advanced Analytics:** ML-based insights and predictions
8. **Multilingual Support:** Add more languages (Chinese, Tamil)
9. **Offline Mode:** PWA with offline-first capabilities
10. **Social Sharing:** Allow visitors to share their visits

---

## Cost Estimation

### Development (One-time)
- Developer time: 4-5 weeks
- Testing & QA: 1 week
- **Estimated Cost:** RM 15,000 - 25,000 (freelance) or in-house

### Hosting (Monthly)
- **Option 1 (Vercel):**
  - Vercel Pro: ~RM 85/month
  - PlanetScale: ~RM 125/month (Scaler plan)
  - **Total:** ~RM 210/month
  
- **Option 2 (Self-hosted VPS):**
  - DigitalOcean Droplet (4GB): ~RM 100/month
  - Database included
  - **Total:** ~RM 100/month

### Domain & SSL
- Domain: ~RM 50/year
- SSL: Free (Let's Encrypt)

---

## Support & Maintenance

### Required Maintenance
- Weekly database backups
- Monthly security updates
- Quarterly feature reviews
- Annual infrastructure review

### Support Plan
- Bug fixes within 48 hours
- Feature requests evaluated monthly
- Documentation updates
- User training materials

---

## Success Metrics

### Technical KPIs
- Page load time < 2 seconds
- API response time < 500ms
- 99.9% uptime
- Zero critical security vulnerabilities

### Business KPIs
- 90%+ visitor registration completion rate
- Average 5+ booth visits per visitor
- 95%+ QR code scan success rate
- Real-time accurate reporting

---

## Contact & Documentation

### Project Resources
- GitHub Repository: [To be created]
- Documentation Wiki: [To be setup]
- API Documentation: [Swagger/OpenAPI]
- User Manual: [PDF Guide]

### Support Channels
- Email: support@mosti.gov.my
- Technical Support: tech-team@mosti.gov.my
- Emergency Hotline: [To be assigned]

---

## Conclusion

This blueprint provides a comprehensive foundation for building the STEM & AI Booth Visit Log Book. The system is designed to be scalable, secure, and user-friendly, with clear separation between admin and visitor interfaces.

**Key Strengths:**
- Professional database IDE-style admin interface
- Bilingual visitor experience
- Robust analytics and reporting
- Secure authentication and data protection
- Mobile-responsive design
- Easy deployment options

**Next Steps:**
1. Review and approve this blueprint
2. Set up development environment
3. Create detailed UI/UX mockups
4. Begin Phase 1 implementation
5. Schedule regular progress reviews

---

**Document Version:** 1.0  
**Last Updated:** December 2, 2025  
**Prepared For:** MOSTI STEM & AI Showcase Event  
**Prepared By:** Development Team
