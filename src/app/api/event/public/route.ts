import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET - Get public event information (no authentication required)
export async function GET(request: NextRequest) {
  try {
    const event = await prisma.event.findFirst({
      select: {
        name: true,
        slogan: true,
        venue: true,
        dateStart: true,
        dateEnd: true,
        description: true,
      },
    })

    if (!event) {
      return NextResponse.json(
        { event: null },
        { status: 200 }
      )
    }

    return NextResponse.json({ event })
  } catch (error) {
    console.error('Get public event error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
