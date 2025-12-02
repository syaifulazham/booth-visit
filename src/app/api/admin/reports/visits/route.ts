import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const visits = await prisma.visit.findMany({
      orderBy: { visitedAt: 'desc' },
      include: {
        visitor: true,
        booth: true,
      },
    })

    // Format data for CSV/JSON
    const formattedData = visits.map(visit => ({
      visitId: visit.id,
      visitorName: visit.visitor.name,
      visitorGender: visit.visitor.gender,
      visitorAge: visit.visitor.age,
      visitorType: visit.visitor.visitorType,
      visitorSektor: visit.visitor.sektor,
      boothName: visit.booth.boothName,
      boothMinistry: visit.booth.ministry,
      boothAgency: visit.booth.agency,
      visitedAt: visit.visitedAt.toISOString(),
      ipAddress: visit.ipAddress || '',
    }))

    return NextResponse.json({ visits: formattedData })
  } catch (error) {
    console.error('Export visits error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
