# Event Backups Directory

This directory contains backup files for the MOSTI STEM & AI Showcase event data.

## 📁 Files

### Demo Backup
- **File:** `DEMO-backup-sample-booths.json.gz`
- **Purpose:** Sample demo data with 15 pre-configured booths
- **Use Case:** Perfect for demonstrations, testing, and showcasing the system

### Production Backups
- **Format:** `backup-YYYY-MM-DDTHH-MM-SS-MMMZ.json.gz`
- **Created:** Automatically when resetting the event via admin panel
- **Contents:** All booths, visitors, and visits data

---

## 🎯 Demo Backup Contents

The demo backup includes **15 Malaysian STEM/AI themed booths**:

| Booth # | Name | Theme |
|---------|------|-------|
| A01 | AI for Agriculture | Smart Farming & Automation |
| A02 | Robotics & Automation | Industry 4.0 |
| A03 | Smart Cities Malaysia | IoT & Urban Planning |
| B01 | Quantum Computing | Advanced Computing |
| B02 | Cybersecurity Hub | Digital Security |
| B03 | Biotechnology Innovation | Genetic Engineering |
| C01 | Renewable Energy Tech | Sustainable Power |
| C02 | Virtual Reality Experience | Immersive Tech |
| C03 | Space Technology | Aerospace |
| D01 | Medical AI & Healthcare | Health Tech |
| D02 | Drone Technology | Autonomous Systems |
| D03 | FinTech & Blockchain | Digital Finance |
| E01 | Environmental Monitoring | Climate Tech |
| E02 | 3D Printing & Manufacturing | Additive Manufacturing |
| E03 | EdTech & Digital Learning | Education Technology |

Each booth includes:
- ✅ Unique QR code hashcode
- ✅ Descriptive name and description
- ✅ Booth number for organization
- ✅ Ready to scan and log visits

---

## 🚀 How to Use Demo Backup

### Option 1: Via Admin Panel (Recommended)

1. **Login to Admin Panel**
   ```
   https://stemai.techlympics.my/admin/event
   ```

2. **Scroll to "Restore from Backup" Section**

3. **Select Demo Backup**
   - Find `DEMO-backup-sample-booths.json.gz` in the list
   - Click the "Restore" button

4. **Confirm Restoration**
   - Enter the confirmation code
   - Click "Restore Backup"

5. **Done!**
   - 15 booths are now loaded
   - Generate QR codes for each booth
   - Ready for demonstrations

### Option 2: Via Command Line

```bash
# On your server
cd ~/apps/booth-visit

# Ensure the demo backup is in the backups directory
ls -lh backups/DEMO-backup-sample-booths.json.gz

# Use the admin panel to restore (no CLI command available yet)
```

---

## 📋 After Restoring Demo Backup

### Generate QR Codes for All Booths

1. Go to: `https://stemai.techlympics.my/admin/booths`
2. For each booth, click the booth name or QR icon
3. View/download QR codes: `https://stemai.techlympics.my/admin/booths/[id]/qr`

### Print QR Codes

Each booth should have:
- QR code poster (A4 size recommended)
- Booth name and number
- Brief description

Place at booth entrance for easy visitor scanning.

---

## 🔄 Creating Your Own Backup

### Manual Backup (Before Resetting)

The system **automatically creates a backup** when you reset the event:

1. Go to: `https://stemai.techlympics.my/admin/event`
2. Click "Reset Event Data"
3. Confirm the reset
4. **Backup is automatically saved** before deletion
5. Check `backups/` directory for the new backup file

### Backup File Format

Backup files contain:
```json
{
  "timestamp": "ISO date string",
  "booths": 15,
  "visitors": 50,
  "visits": 125,
  "data": {
    "booths": [ /* array of booth objects */ ],
    "visitors": [ /* array of visitor objects */ ],
    "visits": [ /* array of visit objects */ ]
  }
}
```

Files are **gzip compressed** to save space.

---

## ⚠️ Important Notes

### Restoration Process

When restoring a backup:
1. ❌ **All existing data is deleted** (booths, visitors, visits)
2. ✅ New data is imported from backup
3. ✅ IDs are regenerated (relationships preserved)
4. ✅ Timestamps are preserved

### Data Preservation

- **Backups are never deleted** by the system
- Store backups safely for disaster recovery
- Regular backups recommended for production events

### File Size

- Typical backup: 1-2 KB (compressed)
- Demo backup: ~1.5 KB (15 booths)
- Large event: May reach 5-10 KB (100+ visitors)

---

## 🛠️ Troubleshooting

### "Failed to restore backup"

**Possible causes:**
- Backup file corrupted
- Invalid JSON format
- Missing required fields

**Solution:**
- Check file integrity
- Verify JSON structure matches expected format
- Try restoring a different backup

### "Backup file not found"

**Possible causes:**
- File not in `backups/` directory
- Incorrect filename
- Permission issues

**Solution:**
```bash
# Check backups directory
ls -lh backups/

# Fix permissions if needed
chmod 644 backups/*.json.gz
```

### Demo backup not appearing in list

**Solution:**
```bash
# Ensure .gz extension
mv backups/DEMO-backup-sample-booths.json backups/DEMO-backup-sample-booths.json.gz

# Or compress it
gzip -k backups/DEMO-backup-sample-booths.json

# Restart server to refresh
pm2 restart stemai
```

---

## 📊 Backup Best Practices

### For Demos
1. ✅ Use the provided demo backup
2. ✅ Reset after each demo session
3. ✅ Keep demo backup file safe

### For Production Events
1. ✅ Create backup before major changes
2. ✅ Keep multiple backups (daily recommended)
3. ✅ Store backups off-server for safety
4. ✅ Test restoration process periodically

### Naming Convention
```
DEMO-backup-sample-booths.json.gz       # Demo data
backup-2025-12-05T10-30-00-000Z.json.gz # Auto-generated
custom-event-name-DATE.json.gz          # Custom backups
```

---

## 🎉 Quick Start for Demos

**5-minute demo setup:**

1. Login admin: `https://stemai.techlympics.my/login`
2. Go to event settings: `/admin/event`
3. Restore demo backup: `DEMO-backup-sample-booths.json.gz`
4. View booths: `/admin/booths`
5. Start scanning: `/` (home page)

**Demo is ready!** 🚀

---

## 📞 Support

If you encounter issues with backups:
1. Check PM2 logs: `pm2 logs stemai`
2. Verify file permissions
3. Ensure database is accessible
4. Check backup file format

For more information, see the main project documentation.

---

## 🔐 Security Note

Backup files may contain sensitive visitor information. Keep them secure:
- ✅ Restrict directory access
- ✅ Do not commit real visitor data to git
- ✅ Demo backup is safe (no real visitors)
- ✅ Use `.gitignore` for production backups

---

Last updated: December 5, 2025
