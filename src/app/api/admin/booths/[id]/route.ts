import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { boothSchema } from '@/lib/validators'

// GET - Get single booth
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const booth = await prisma.booth.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: { visits: true },
        },
      },
    })

    if (!booth) {
      return NextResponse.json({ error: 'Booth not found' }, { status: 404 })
    }

    return NextResponse.json({ booth })
  } catch (error) {
    console.error('Get booth error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// PUT - Update booth
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  let boothNumberAttempted: string | null = null
  
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = boothSchema.parse(body)

    // Convert empty strings to null for optional fields
    const updateData = {
      ...validatedData,
      boothNumber: validatedData.boothNumber || null,
      picName: validatedData.picName || null,
      picPhone: validatedData.picPhone || null,
      picEmail: validatedData.picEmail || null,
    }
    
    // Store booth number for error handling
    boothNumberAttempted = updateData.boothNumber

    const booth = await prisma.booth.update({
      where: { id: params.id },
      data: updateData,
    })

    return NextResponse.json({ booth })
  } catch (error: any) {
    console.error('Update booth error:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }
    
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Booth not found' }, { status: 404 })
    }
    
    // Check for unique constraint violation on boothNumber
    if (error.code === 'P2002' && error.meta?.target?.includes('boothNumber') && boothNumberAttempted) {
      try {
        // Find which booth has this booth number
        const existingBooth = await prisma.booth.findUnique({
          where: { boothNumber: boothNumberAttempted },
          select: { boothName: true, boothNumber: true }
        })
        
        if (existingBooth) {
          return NextResponse.json(
            { error: `This Booth Number already assigned to "${existingBooth.boothName}"` },
            { status: 409 }
          )
        }
      } catch (fetchError) {
        // Fallback to generic message if we can't fetch the booth
      }
      
      return NextResponse.json(
        { error: 'Booth number already exists. Please use a different booth number.' },
        { status: 409 }
      )
    }
    
    return NextResponse.json({ error: 'Server error', message: error.message }, { status: 500 })
  }
}

// DELETE - Delete booth
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.booth.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Delete booth error:', error)
    
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Booth not found' }, { status: 404 })
    }
    
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
