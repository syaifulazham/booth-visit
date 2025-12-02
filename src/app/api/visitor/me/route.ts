import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const visitorCookie = cookieStore.get('visitor_id')

    // Get total booth count
    const totalBooths = await prisma.booth.count()

    if (!visitorCookie) {
      return NextResponse.json({ 
        visitor: null,
        totalBooths 
      })
    }

    const visitor = await prisma.visitor.findUnique({
      where: { cookieId: visitorCookie.value },
      include: {
        visits: {
          include: {
            booth: {
              select: {
                boothName: true,
                agency: true,
                ministry: true,
              },
            },
          },
          orderBy: {
            visitedAt: 'desc',
          },
        },
      },
    })

    if (!visitor) {
      return NextResponse.json({ 
        visitor: null,
        totalBooths 
      })
    }

    return NextResponse.json({ 
      visitor,
      totalBooths 
    })
  } catch (error) {
    console.error('Error fetching visitor:', error)
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    )
  }
}
