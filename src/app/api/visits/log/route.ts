import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { cookies } from 'next/headers'
import { getClientIP } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { hashcode } = body

    if (!hashcode) {
      return NextResponse.json(
        { error: 'Hashcode diperlukan / Hashcode required' },
        { status: 400 }
      )
    }

    // Get visitor from cookie
    const cookieStore = await cookies()
    const visitorCookie = cookieStore.get('visitor_id')

    if (!visitorCookie) {
      return NextResponse.json(
        { error: 'Sila daftar dahulu / Please register first' },
        { status: 401 }
      )
    }

    // Find visitor
    const visitor = await prisma.visitor.findUnique({
      where: { cookieId: visitorCookie.value },
    })

    if (!visitor) {
      return NextResponse.json(
        { error: 'Pelawat tidak dijumpai / Visitor not found' },
        { status: 404 }
      )
    }

    // Find booth
    const booth = await prisma.booth.findUnique({
      where: { hashcode },
    })

    if (!booth) {
      return NextResponse.json(
        { error: 'Gerai tidak dijumpai / Booth not found' },
        { status: 404 }
      )
    }

    // Check if already visited
    const existingVisit = await prisma.visit.findUnique({
      where: {
        visitorId_boothId: {
          visitorId: visitor.id,
          boothId: booth.id,
        },
      },
    })

    if (existingVisit) {
      return NextResponse.json(
        { error: 'Sudah dilawati / Already visited' },
        { status: 409 }
      )
    }

    // Log visit
    const visit = await prisma.visit.create({
      data: {
        visitorId: visitor.id,
        boothId: booth.id,
        ipAddress: getClientIP(request),
        userAgent: request.headers.get('user-agent'),
      },
      include: {
        visitor: true,
        booth: true,
      },
    })

    return NextResponse.json({ success: true, visit })
  } catch (error) {
    console.error('Log visit error:', error)
    return NextResponse.json(
      { error: 'Ralat pelayan / Server error' },
      { status: 500 }
    )
  }
}
