import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const visitorCookie = cookieStore.get('visitor_id')
    
    if (!visitorCookie) {
      return NextResponse.json({ registered: false })
    }
    
    const visitor = await prisma.visitor.findUnique({
      where: { cookieId: visitorCookie.value },
      select: {
        id: true,
        name: true,
        gender: true,
        age: true,
        visitorType: true,
        sektor: true,
        createdAt: true,
      },
    })
    
    if (!visitor) {
      return NextResponse.json({ registered: false })
    }
    
    return NextResponse.json({
      registered: true,
      visitor,
    })
  } catch (error) {
    console.error('Check visitor error:', error)
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    )
  }
}
