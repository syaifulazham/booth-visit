import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// GET - Get current logged-in user session
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({
      user: {
        email: session.user?.email,
        name: session.user?.name,
      },
    })
  } catch (error) {
    console.error('Get current user error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
