import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { gunzipSync } from 'zlib'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { filename } = body

    if (!filename || !filename.endsWith('.json.gz')) {
      return NextResponse.json(
        { error: 'Invalid backup filename' },
        { status: 400 }
      )
    }

    // Read and decompress backup file
    const backupDir = join(process.cwd(), 'backups')
    const filepath = join(backupDir, filename)
    
    let backupData
    try {
      const compressed = await readFile(filepath)
      const decompressed = gunzipSync(compressed)
      backupData = JSON.parse(decompressed.toString())
    } catch (error) {
      return NextResponse.json(
        { error: 'Failed to read backup file' },
        { status: 400 }
      )
    }

    // Validate backup data structure
    if (!backupData.data || !backupData.data.booths || !backupData.data.visitors || !backupData.data.visits) {
      return NextResponse.json(
        { error: 'Invalid backup file format' },
        { status: 400 }
      )
    }

    // Step 1: Clear existing data
    await prisma.$transaction([
      prisma.visit.deleteMany({}),
      prisma.visitor.deleteMany({}),
      prisma.booth.deleteMany({}),
    ])

    // Step 2: Restore booths
    const boothIdMap = new Map() // Map old IDs to new IDs
    for (const booth of backupData.data.booths) {
      const { id, visits, createdAt, updatedAt, ...boothData } = booth
      const newBooth = await prisma.booth.create({
        data: {
          ...boothData,
          createdAt: new Date(createdAt),
          updatedAt: new Date(updatedAt),
        },
      })
      boothIdMap.set(id, newBooth.id)
    }

    // Step 3: Restore visitors
    const visitorIdMap = new Map() // Map old IDs to new IDs
    for (const visitor of backupData.data.visitors) {
      const { id, visits, createdAt, updatedAt, ...visitorData } = visitor
      const newVisitor = await prisma.visitor.create({
        data: {
          ...visitorData,
          createdAt: new Date(createdAt),
          updatedAt: new Date(updatedAt),
        },
      })
      visitorIdMap.set(id, newVisitor.id)
    }

    // Step 4: Restore visits
    let restoredVisits = 0
    for (const visit of backupData.data.visits) {
      const { id, booth, visitor, visitedAt, ...visitData } = visit
      
      const newBoothId = boothIdMap.get(visit.boothId)
      const newVisitorId = visitorIdMap.get(visit.visitorId)
      
      if (newBoothId && newVisitorId) {
        await prisma.visit.create({
          data: {
            ...visitData,
            boothId: newBoothId,
            visitorId: newVisitorId,
            visitedAt: new Date(visitedAt),
          },
        })
        restoredVisits++
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Backup restored successfully',
      restored: {
        booths: backupData.data.booths.length,
        visitors: backupData.data.visitors.length,
        visits: restoredVisits,
        timestamp: backupData.timestamp,
      },
    })
  } catch (error: any) {
    console.error('Restore backup error:', error)
    return NextResponse.json(
      { error: 'Failed to restore backup', details: error.message },
      { status: 500 }
    )
  }
}
