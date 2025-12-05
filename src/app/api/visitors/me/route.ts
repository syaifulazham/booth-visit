import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Get visitor from cookie
    const cookieStore = await cookies()
    const visitorCookieId = cookieStore.get('visitor_id')?.value
    
    if (!visitorCookieId) {
      return NextResponse.json(
        { error: 'Tiada sesi pelawat / No visitor session' },
        { status: 401 }
      )
    }

    // Find visitor by cookie ID
    const visitor = await prisma.visitor.findUnique({
      where: { cookieId: visitorCookieId },
      include: {
        visits: {
          include: {
            booth: true,
          },
          orderBy: {
            visitedAt: 'desc',
          },
        },
      },
    })

    if (!visitor) {
      return NextResponse.json(
        { error: 'Pelawat tidak dijumpai / Visitor not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { 
        success: true,
        visitor: {
          id: visitor.id,
          name: visitor.name,
          email: visitor.email,
          gender: visitor.gender,
          phone: visitor.phone,
          state: visitor.state,
          age: visitor.age,
          visitorType: visitor.visitorType,
          sektor: visitor.sektor,
          cookieId: visitor.cookieId,
          visits: visitor.visits,
        }
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Visitor fetch error:', error)
    
    return NextResponse.json(
      { error: 'Ralat pelayan / Server error' },
      { status: 500 }
    )
  }
}
