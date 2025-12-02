import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const booths = await prisma.booth.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { visits: true },
        },
      },
    })

    // Format data for CSV/JSON
    const formattedData = booths.map(booth => ({
      id: booth.id,
      boothName: booth.boothName,
      ministry: booth.ministry,
      agency: booth.agency,
      abbreviationName: booth.abbreviationName,
      picName: booth.picName || '',
      picPhone: booth.picPhone || '',
      picEmail: booth.picEmail || '',
      totalVisits: booth._count.visits,
      hashcode: booth.hashcode,
      createdAt: booth.createdAt.toISOString(),
    }))

    return NextResponse.json({ booths: formattedData })
  } catch (error) {
    console.error('Export booths error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
