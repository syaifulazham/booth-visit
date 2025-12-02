import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const visitors = await prisma.visitor.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { visits: true },
        },
      },
    })

    // Format data for CSV/JSON
    const formattedData = visitors.map(visitor => ({
      id: visitor.id,
      name: visitor.name,
      gender: visitor.gender,
      age: visitor.age,
      visitorType: visitor.visitorType,
      sektor: visitor.sektor,
      totalVisits: visitor._count.visits,
      registeredAt: visitor.createdAt.toISOString(),
    }))

    return NextResponse.json({ visitors: formattedData })
  } catch (error) {
    console.error('Export visitors error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
