import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { gzipSync } from 'zlib'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Step 1: Fetch all data for backup
    const [booths, visitors, visits] = await Promise.all([
      prisma.booth.findMany({
        include: {
          visits: true,
        },
      }),
      prisma.visitor.findMany({
        include: {
          visits: true,
        },
      }),
      prisma.visit.findMany({
        include: {
          booth: true,
          visitor: true,
        },
      }),
    ])

    // Step 2: Create backup data object
    const backupData = {
      timestamp: new Date().toISOString(),
      booths: booths.length,
      visitors: visitors.length,
      visits: visits.length,
      data: {
        booths,
        visitors,
        visits,
      },
    }

    // Step 3: Compress the backup data
    const jsonString = JSON.stringify(backupData, null, 2)
    const compressed = gzipSync(jsonString)

    // Step 4: Save compressed backup to file
    const backupDir = join(process.cwd(), 'backups')
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filename = `backup-${timestamp}.json.gz`
    const filepath = join(backupDir, filename)

    try {
      // Create backup directory if it doesn't exist
      const { mkdir } = await import('fs/promises')
      await mkdir(backupDir, { recursive: true })
      await writeFile(filepath, compressed)
    } catch (fileError) {
      console.error('Backup file error:', fileError)
      // Continue with deletion even if backup fails, but log it
    }

    // Step 5: Delete all data from tables (in correct order due to foreign keys)
    await prisma.$transaction([
      prisma.visit.deleteMany({}),
      prisma.visitor.deleteMany({}),
      prisma.booth.deleteMany({}),
    ])

    return NextResponse.json({
      success: true,
      message: 'Event reset successful',
      backup: {
        filename,
        filepath,
        stats: {
          booths: booths.length,
          visitors: visitors.length,
          visits: visits.length,
        },
      },
    })
  } catch (error: any) {
    console.error('Reset event error:', error)
    return NextResponse.json(
      { error: 'Failed to reset event', details: error.message },
      { status: 500 }
    )
  }
}
