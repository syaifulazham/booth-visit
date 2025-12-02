import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { boothSchema } from '@/lib/validators'
import { generateHashcode } from '@/lib/utils'

export const dynamic = 'force-dynamic'

// GET - List all booths
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const booths = await prisma.booth.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { visits: true },
        },
      },
    })

    return NextResponse.json({ booths })
  } catch (error) {
    console.error('Get booths error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// POST - Create new booth
export async function POST(request: NextRequest) {
  let boothNumberAttempted: string | null = null
  
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = boothSchema.parse(body)
    
    // Generate unique hashcode
    const hashcode = generateHashcode()
    
    // Convert empty strings to null for optional fields
    const createData = {
      ...validatedData,
      boothNumber: validatedData.boothNumber || null,
      picName: validatedData.picName || null,
      picPhone: validatedData.picPhone || null,
      picEmail: validatedData.picEmail || null,
      hashcode,
    }
    
    // Store booth number for error handling
    boothNumberAttempted = createData.boothNumber
    
    const booth = await prisma.booth.create({
      data: createData,
    })

    return NextResponse.json({ booth }, { status: 201 })
  } catch (error: any) {
    console.error('Create booth error:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
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
    
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
