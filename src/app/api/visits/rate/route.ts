import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const ratingSchema = z.object({
  visitId: z.string(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(500).nullable().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = ratingSchema.parse(body)

    // Check if visit exists
    const visit = await prisma.visit.findUnique({
      where: { id: validatedData.visitId },
    })

    if (!visit) {
      return NextResponse.json(
        { error: 'Visit not found' },
        { status: 404 }
      )
    }

    // Update visit with rating and comment (allows updating existing ratings)
    const updatedVisit = await prisma.visit.update({
      where: { id: validatedData.visitId },
      data: {
        rating: validatedData.rating,
        comment: validatedData.comment || null,
      },
    })

    return NextResponse.json({
      success: true,
      visit: updatedVisit,
      message: visit.rating ? 'Rating updated' : 'Rating submitted',
    })
  } catch (error: any) {
    console.error('Rating submission error:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    )
  }
}
