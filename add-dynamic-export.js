const fs = require('fs');
const path = require('path');

// List of API route files to update
const apiRoutes = [
  'src/app/api/visitors/register/route.ts',
  'src/app/api/visitors/check/route.ts',
  'src/app/api/visits/rate/route.ts',
  'src/app/api/visits/log/route.ts',
  'src/app/api/visits/[visitId]/route.ts',
  'src/app/api/admin/users/route.ts',
  'src/app/api/admin/users/[id]/route.ts',
  'src/app/api/admin/event/reset/route.ts',
  'src/app/api/admin/event/restore/route.ts',
  'src/app/api/admin/event/backups/route.ts',
  'src/app/api/admin/booths/route.ts',
  'src/app/api/admin/booths/[id]/route.ts',
  'src/app/api/admin/reports/visitors/route.ts',
  'src/app/api/admin/reports/booths/route.ts',
  'src/app/api/visitor/me/route.ts',
  'src/app/api/event/public/route.ts',
  'src/app/api/booths/verify/[hashcode]/route.ts',
  'src/app/api/booths/public/route.ts',
];

const dynamicExport = "export const dynamic = 'force-dynamic'";

apiRoutes.forEach((filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Check if already has the export
      if (content.includes(dynamicExport)) {
        console.log(`✓ Skipping ${filePath} (already has dynamic export)`);
        return;
      }
      
      // Find the last import statement
      const lines = content.split('\n');
      let lastImportIndex = -1;
      
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim().startsWith('import ')) {
          lastImportIndex = i;
        }
      }
      
      if (lastImportIndex !== -1) {
        // Insert after the last import, with a blank line
        lines.splice(lastImportIndex + 1, 0, '', dynamicExport);
        content = lines.join('\n');
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✓ Added dynamic export to ${filePath}`);
      } else {
        console.log(`⚠ Could not find import statements in ${filePath}`);
      }
    } else {
      console.log(`✗ File not found: ${filePath}`);
    }
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message);
  }
});

console.log('\nDone! All API routes updated.');
