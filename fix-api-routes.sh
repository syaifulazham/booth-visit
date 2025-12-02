#!/bin/bash

# Script to add 'export const dynamic = force-dynamic' to all API routes

API_ROUTES=(
  "src/app/api/visitors/register/route.ts"
  "src/app/api/visitors/check/route.ts"
  "src/app/api/visits/rate/route.ts"
  "src/app/api/visits/log/route.ts"
  "src/app/api/visits/[visitId]/route.ts"
  "src/app/api/admin/users/route.ts"
  "src/app/api/admin/users/[id]/route.ts"
  "src/app/api/admin/event/reset/route.ts"
  "src/app/api/admin/event/route.ts"
  "src/app/api/admin/event/restore/route.ts"
  "src/app/api/admin/event/backups/route.ts"
  "src/app/api/admin/booths/route.ts"
  "src/app/api/admin/booths/[id]/route.ts"
  "src/app/api/admin/reports/visitors/route.ts"
  "src/app/api/admin/reports/visits/route.ts"
  "src/app/api/admin/reports/booths/route.ts"
  "src/app/api/visitor/me/route.ts"
  "src/app/api/event/public/route.ts"
  "src/app/api/booths/verify/[hashcode]/route.ts"
  "src/app/api/booths/public/route.ts"
)

for route in "${API_ROUTES[@]}"; do
  if [ -f "$route" ]; then
    # Check if already has the export
    if ! grep -q "export const dynamic = 'force-dynamic'" "$route"; then
      echo "Adding dynamic export to $route"
      
      # Add after imports, before first export function or comment
      sed -i.bak "/^import.*$/a\\
\\
export const dynamic = 'force-dynamic'" "$route"
      
      # Clean up backup file
      rm "${route}.bak"
    else
      echo "Skipping $route (already has dynamic export)"
    fi
  else
    echo "File not found: $route"
  fi
done

echo "Done! All API routes updated."
