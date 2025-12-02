import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { cookies } from 'next/headers'

export async function GET(
  request: NextRequest,
  { params }: { params: { visitId: string } }
) {
  try {
    const cookieStore = await cookies()
    const visitorCookie = cookieStore.get('visitor_id')

    if (!visitorCookie) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const visit = await prisma.visit.findUnique({
      where: { id: params.visitId },
      include: {
        booth: {
          select: {
            boothName: true,
            agency: true,
            ministry: true,
          },
        },
        visitor: {
          select: {
            cookieId: true,
          },
        },
      },
    })

    if (!visit) {
      return NextResponse.json(
        { error: 'Visit not found' },
        { status: 404 }
      )
    }

    // Verify that the visit belongs to the current visitor
    if (visit.visitor.cookieId !== visitorCookie.value) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    return NextResponse.json({ visit })
  } catch (error) {
    console.error('Get visit error:', error)
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    )
  }
}
