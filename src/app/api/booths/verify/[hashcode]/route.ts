import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { hashcode: string } }
) {
  try {
    const booth = await prisma.booth.findUnique({
      where: { hashcode: params.hashcode },
      select: {
        id: true,
        boothName: true,
        agency: true,
      },
    })

    if (!booth) {
      return NextResponse.json(
        { error: 'Booth not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ booth })
  } catch (error) {
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    )
  }
}
