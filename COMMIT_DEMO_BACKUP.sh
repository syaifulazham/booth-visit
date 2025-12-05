#!/bin/bash

# Commit script for demo backup inclusion

echo "🎯 Committing demo backup and documentation..."

# Stage all changes
git add .gitignore
git add README.md
git add INSTALLATION_DEMO.md
git add backups/.gitkeep
git add backups/DEMO-backup-sample-booths.json.gz
git add backups/README.md

# Optional: Add other new files if needed
git add FIX_MIGRATION.md 2>/dev/null
git add SERVER_DEPLOY_COMMANDS.sh 2>/dev/null
git add REGISTRATION_EDIT_SEPARATION.md 2>/dev/null

# Show what will be committed
echo ""
echo "📋 Files to be committed:"
git status --short

echo ""
echo "📝 Commit message:"
echo "✅ Include demo backup with installation

- Add pre-installed demo backup with 15 Malaysian STEM/AI booths
- Update .gitignore to include demo backup while ignoring others
- Add INSTALLATION_DEMO.md with comprehensive demo setup guide
- Update README.md with demo backup section
- All installations will now have demo data ready to restore

Demo backup includes:
- 15 professional booths (MARDI, MIGHT, MDEC, etc.)
- Complete booth information and contact details
- Unique QR hashcodes for each booth
- Perfect for demos, testing, and client presentations

Version: 0.3.0"

echo ""
read -p "❓ Commit these changes? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]
then
    git commit -m "✅ Include demo backup with installation

- Add pre-installed demo backup with 15 Malaysian STEM/AI booths
- Update .gitignore to include demo backup while ignoring others
- Add INSTALLATION_DEMO.md with comprehensive demo setup guide
- Update README.md with demo backup section
- All installations will now have demo data ready to restore

Demo backup includes:
- 15 professional booths (MARDI, MIGHT, MDEC, etc.)
- Complete booth information and contact details
- Unique QR hashcodes for each booth
- Perfect for demos, testing, and client presentations

Version: 0.3.0"
    
    echo ""
    echo "✅ Committed successfully!"
    echo ""
    echo "🚀 Next step: Push to remote"
    echo "   git push origin main"
else
    echo ""
    echo "❌ Commit cancelled"
fi
