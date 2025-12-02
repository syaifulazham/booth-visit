import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { visitorSchema } from '@/lib/validators'
import { generateCookieId, getClientIP } from '@/lib/utils'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = visitorSchema.parse(body)
    
    // Check if visitor with this phone already exists
    const existingVisitor = await prisma.visitor.findUnique({
      where: { phone: validatedData.phone },
    })

    let visitor
    let cookieId

    if (existingVisitor) {
      // Update existing visitor's cookie
      cookieId = existingVisitor.cookieId
      visitor = existingVisitor
    } else {
      // Generate cookie ID for new visitor
      cookieId = generateCookieId()

      // Create visitor in database
      visitor = await prisma.visitor.create({
        data: {
          ...validatedData,
          cookieId,
        },
      })
    }
    
    // Set cookie for 2 days
    const cookieStore = await cookies()
    cookieStore.set('visitor_id', visitor.cookieId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: parseInt(process.env.COOKIE_MAX_AGE || '172800'), // 2 days
      path: '/',
    })
    
    return NextResponse.json(
      { 
        success: true,
        isReturning: !!existingVisitor,
        visitor: {
          id: visitor.id,
          name: visitor.name,
          phone: visitor.phone,
          cookieId: visitor.cookieId,
        }
      },
      { status: existingVisitor ? 200 : 201 }
    )
  } catch (error: any) {
    console.error('Visitor registration error:', error)
    
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
