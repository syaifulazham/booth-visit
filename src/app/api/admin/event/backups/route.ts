import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { readdir, stat } from 'fs/promises'
import { join } from 'path'

export const dynamic = 'force-dynamic'

// GET - List all backup files
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const backupDir = join(process.cwd(), 'backups')
    
    try {
      const files = await readdir(backupDir)
      const backupFiles = files.filter(file => file.endsWith('.json.gz'))
      
      // Get file details
      const backupsWithStats = await Promise.all(
        backupFiles.map(async (file) => {
          const filepath = join(backupDir, file)
          const stats = await stat(filepath)
          return {
            filename: file,
            size: stats.size,
            created: stats.birthtime,
            modified: stats.mtime,
          }
        })
      )
      
      // Sort by creation date (newest first)
      backupsWithStats.sort((a, b) => b.created.getTime() - a.created.getTime())
      
      return NextResponse.json({ backups: backupsWithStats })
    } catch (error) {
      // Directory doesn't exist or is empty
      return NextResponse.json({ backups: [] })
    }
  } catch (error: any) {
    console.error('List backups error:', error)
    return NextResponse.json(
      { error: 'Failed to list backups' },
      { status: 500 }
    )
  }
}
