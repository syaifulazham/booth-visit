import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const booths = await prisma.booth.findMany({
      select: {
        id: true,
        boothNumber: true,
        boothName: true,
        agency: true,
        ministry: true,
        abbreviationName: true,
      },
      orderBy: [
        { boothNumber: 'asc' },
        { boothName: 'asc' },
      ],
    })

    return NextResponse.json({ booths })
  } catch (error) {
    console.error('Get public booths error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
