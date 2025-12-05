import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { visitorSchema } from '@/lib/validators'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
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
    const existingVisitor = await prisma.visitor.findUnique({
      where: { cookieId: visitorCookieId },
    })

    if (!existingVisitor) {
      return NextResponse.json(
        { error: 'Pelawat tidak dijumpai / Visitor not found' },
        { status: 404 }
      )
    }

    // Validate input
    const validatedData = visitorSchema.parse(body)
    
    // Check if email is being changed to one that already exists
    if (validatedData.email !== existingVisitor.email) {
      const emailExists = await prisma.visitor.findUnique({
        where: { email: validatedData.email },
      })
      
      if (emailExists) {
        return NextResponse.json(
          { error: 'Emel sudah digunakan / Email already in use' },
          { status: 400 }
        )
      }
    }

    // Update visitor in database
    const updatedVisitor = await prisma.visitor.update({
      where: { id: existingVisitor.id },
      data: validatedData,
    })
    
    return NextResponse.json(
      { 
        success: true,
        visitor: {
          id: updatedVisitor.id,
          name: updatedVisitor.name,
          email: updatedVisitor.email,
        }
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Visitor update error:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Data tidak sah / Invalid data', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Ralat pelayan / Server error' },
      { status: 500 }
    )
  }
}
