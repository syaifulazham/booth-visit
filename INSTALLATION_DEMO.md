# Quick Demo Installation Guide

This guide helps you get the MOSTI STEM & AI Showcase system up and running with pre-loaded demo data.

---

## 🎯 What's Included

The repository comes with a **pre-installed demo backup**:
- ✅ **15 Malaysian STEM/AI themed booths**
- ✅ Complete booth information (ministry, agency, contact person)
- ✅ Unique QR codes for each booth
- ✅ Ready for immediate demonstrations

**Location:** `backups/DEMO-backup-sample-booths.json.gz`

---

## 🚀 Quick Start (5 Minutes)

### **Step 1: Clone and Install**
```bash
git clone https://github.com/your-username/booth-visit.git
cd booth-visit
npm install
```

### **Step 2: Setup Environment**
```bash
cp .env.example .env
# Edit .env with your database credentials
```

### **Step 3: Database Setup**
```bash
# Create database
mysql -u root -p
CREATE DATABASE `booth-visit-db`;
exit;

# Run migrations
npx prisma migrate deploy
npx prisma generate
```

### **Step 4: Build Application**
```bash
npm run build
```

### **Step 5: Start Application**
```bash
# Development
npm run dev

# Production
npm start
# or with PM2
pm2 start npm --name "stemai" -- start
```

### **Step 6: Login to Admin**
```bash
# Create admin user first (if not exists)
npx prisma db seed

# Login at: http://localhost:3001/login
# Default credentials from seed script
```

### **Step 7: Restore Demo Backup**
1. Go to: http://localhost:3001/admin/event
2. Scroll to **"Restore from Backup"** section
3. Select: `DEMO-backup-sample-booths.json.gz`
4. Click **"Restore"** button
5. Enter confirmation code
6. Click **"Restore Backup"**

### **Step 8: Done!** 🎉
- View booths: http://localhost:3001/admin/booths
- Generate QR codes for each booth
- Start demo!

---

## 📋 Pre-Installed Demo Booths

The demo backup includes **15 professionally crafted booths**:

| # | Booth | Agency | Theme |
|---|-------|--------|-------|
| 1 | AI for Agriculture | MARDI | Smart Farming 🌾 |
| 2 | Robotics & Automation | MIGHT | Industry 4.0 🤖 |
| 3 | Smart Cities Malaysia | MDEC | IoT & Urban Planning 🏙️ |
| 4 | Quantum Computing | NAv6 | Advanced Computing ⚛️ |
| 5 | Cybersecurity Hub | NACSA | Digital Security 🔒 |
| 6 | Biotechnology Innovation | BiotechCorp | Genetic Engineering 🧬 |
| 7 | Renewable Energy Tech | MGTC | Sustainable Power ⚡ |
| 8 | Virtual Reality Experience | MDeC | Immersive Tech 🥽 |
| 9 | Space Technology | MYSA | Aerospace 🚀 |
| 10 | Medical AI & Healthcare | IMR | Health Tech 🏥 |
| 11 | Drone Technology | Aerodyne | Autonomous Systems 🚁 |
| 12 | FinTech & Blockchain | SC | Digital Finance 💰 |
| 13 | Environmental Monitoring | MetMalaysia | Climate Tech 🌍 |
| 14 | 3D Printing & Manufacturing | SIRIM | Additive Manufacturing 🖨️ |
| 15 | EdTech & Digital Learning | MYREN | Education Technology 📚 |

---

## 🎯 Perfect For

| Use Case | Description |
|----------|-------------|
| **Product Demos** | Show clients how the system works |
| **Training Sessions** | Teach admins and booth operators |
| **Testing** | Verify all features work correctly |
| **Development** | Quick setup for developers |
| **Client Presentations** | Impressive professional setup |

---

## 🔄 Reset & Restore

### **Reset Event (Clear All Data)**
1. Admin Panel → Event Settings
2. Click "Reset Event Data"
3. Confirm with code
4. All booths, visitors, visits deleted
5. Automatic backup created before reset

### **Restore Demo Backup**
1. Admin Panel → Event Settings
2. Scroll to "Restore from Backup"
3. Select demo backup
4. Confirm restoration
5. Demo booths loaded again!

**Note:** You can reset and restore as many times as needed for demos!

---

## 📁 Backup Files Location

```
backups/
├── DEMO-backup-sample-booths.json.gz  ← Pre-installed demo (tracked in git)
├── backup-YYYY-MM-DDTHH-MM-SS.json.gz ← Auto-created backups (gitignored)
└── README.md                          ← Backup documentation
```

**Key Points:**
- ✅ Demo backup is version controlled (committed to git)
- ✅ Auto-created backups are gitignored (not committed)
- ✅ Demo backup survives git pull/deployment
- ✅ Production backups stay on server only

---

## 🎨 Customizing Demo Data

If you want to modify the demo backup:

1. **Extract the backup:**
   ```bash
   gunzip -c backups/DEMO-backup-sample-booths.json.gz > temp-backup.json
   ```

2. **Edit the JSON file:**
   - Modify booth names, agencies, descriptions
   - Change QR hashcodes
   - Update contact information

3. **Compress it back:**
   ```bash
   gzip -c temp-backup.json > backups/DEMO-backup-sample-booths.json.gz
   rm temp-backup.json
   ```

4. **Commit changes:**
   ```bash
   git add backups/DEMO-backup-sample-booths.json.gz
   git commit -m "Update demo backup data"
   git push
   ```

---

## 🚀 Production Deployment

### **On Your Server:**

```bash
# Clone repository
cd /var/www/
git clone https://github.com/your-username/booth-visit.git
cd booth-visit

# Install dependencies
npm install

# Setup environment
cp .env.example .env
nano .env  # Configure database and secrets

# Database setup
npx prisma migrate deploy
npx prisma generate

# Build
npm run build

# Start with PM2
pm2 start npm --name "stemai" -- start
pm2 save
```

**The demo backup is already there!** Just restore it via admin panel.

---

## ✅ Verification Checklist

After installation, verify:

- [ ] Application loads at http://localhost:3001
- [ ] Admin login works
- [ ] Event settings page accessible
- [ ] Demo backup shows in backup list
- [ ] Restore demo backup successfully
- [ ] 15 booths appear in admin/booths
- [ ] QR codes can be generated
- [ ] Visitor registration works
- [ ] QR scanning works
- [ ] Visit logging works

---

## 🐛 Troubleshooting

### **Demo backup not appearing in list**

**Cause:** Backups directory permission issue or file missing

**Solution:**
```bash
# Check if file exists
ls -lh backups/DEMO-backup-sample-booths.json.gz

# If missing, pull from git
git pull origin main

# Check permissions
chmod 644 backups/DEMO-backup-sample-booths.json.gz
```

### **Restore fails with "Invalid backup file format"**

**Cause:** Corrupted or incompatible backup file

**Solution:**
```bash
# Verify file integrity
gunzip -t backups/DEMO-backup-sample-booths.json.gz

# If corrupted, re-download from git
git checkout backups/DEMO-backup-sample-booths.json.gz
```

### **"Failed to restore backup" error**

**Cause:** Database schema mismatch or missing fields

**Solution:**
```bash
# Ensure migrations are up to date
npx prisma migrate deploy
npx prisma generate

# Restart application
pm2 restart stemai
```

---

## 📚 Related Documentation

- **Backup System:** `backups/README.md`
- **Full Deployment Guide:** `deploy.sh`
- **Server Setup:** `SERVER_DEPLOY_COMMANDS.sh`
- **Registration Simplification:** `REGISTRATION_EDIT_SEPARATION.md`

---

## 🎉 Summary

**Installation with Demo Backup:**
1. ✅ Clone repository (demo backup included)
2. ✅ Install dependencies
3. ✅ Setup database
4. ✅ Build application
5. ✅ Start server
6. ✅ Login to admin
7. ✅ Restore demo backup
8. ✅ **Ready for demo!**

**Total Time:** ~5 minutes

**Result:** Professional demo setup with 15 Malaysian STEM/AI booths ready to showcase!

---

## 🌟 Pro Tips

### **For Demos:**
- Reset event after each demo session
- Restore demo backup before each new demo
- Keep original demo backup untouched

### **For Development:**
- Use demo backup as starting point
- Create custom backups for testing
- Reset frequently to clean state

### **For Production:**
- Keep demo backup for emergencies
- Create regular backups of real data
- Store production backups securely off-server

---

## 🔗 Quick Links

- **Admin Login:** http://localhost:3001/login
- **Event Settings:** http://localhost:3001/admin/event
- **Booth Management:** http://localhost:3001/admin/booths
- **Visitor Registration:** http://localhost:3001/register
- **Home Page:** http://localhost:3001/

---

**Enjoy your demo! 🚀**

*The demo backup is maintained and version-controlled to ensure consistent experiences across all installations.*
