import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { eventSchema } from '@/lib/validators'

// GET - Get current event (there should only be one)
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the first (and should be only) event
    const event = await prisma.event.findFirst()

    return NextResponse.json({ event })
  } catch (error) {
    console.error('Get event error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// PUT - Update or create event
export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = eventSchema.parse(body)

    // Convert string dates to Date objects
    const eventData = {
      name: validatedData.name,
      slogan: validatedData.slogan || null,
      venue: validatedData.venue,
      dateStart: new Date(validatedData.dateStart),
      dateEnd: new Date(validatedData.dateEnd),
      description: validatedData.description || null,
    }

    // Check if an event already exists
    const existingEvent = await prisma.event.findFirst()

    let event
    if (existingEvent) {
      // Update existing event
      event = await prisma.event.update({
        where: { id: existingEvent.id },
        data: eventData,
      })
    } else {
      // Create new event
      event = await prisma.event.create({
        data: eventData,
      })
    }

    return NextResponse.json({ event })
  } catch (error: any) {
    console.error('Update event error:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
