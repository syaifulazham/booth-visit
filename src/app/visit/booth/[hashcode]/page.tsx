import { prisma } from '@/lib/db'
import { cookies } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import { VisitSuccess } from '@/components/visitor/VisitSuccess'
import { getClientIP } from '@/lib/utils'

export const dynamic = 'force-dynamic'

async function getBooth(hashcode: string) {
  return await prisma.booth.findUnique({
    where: { hashcode },
  })
}

async function getVisitor(cookieId: string) {
  return await prisma.visitor.findUnique({
    where: { cookieId },
  })
}

async function logVisit(visitorId: string, boothId: string, ipAddress: string | null, userAgent: string | null) {
  try {
    const visit = await prisma.visit.create({
      data: {
        visitorId,
        boothId,
        ipAddress,
        userAgent,
      },
      include: {
        visitor: true,
        booth: true,
      },
    })
    return { success: true, visit }
  } catch (error: any) {
    // Check if it's a unique constraint violation (duplicate visit)
    if (error.code === 'P2002') {
      return { success: false, error: 'already_visited' }
    }
    throw error
  }
}

export default async function VisitBoothPage({
  params,
}: {
  params: { hashcode: string }
}) {
  // Get booth
  const booth = await getBooth(params.hashcode)
  if (!booth) {
    notFound()
  }

  // Check if visitor is registered
  const cookieStore = await cookies()
  const visitorCookie = cookieStore.get('visitor_id')

  if (!visitorCookie) {
    // Redirect to registration with return URL
    redirect(`/register?redirect=/visit/booth/${params.hashcode}`)
  }

  // Get visitor
  const visitor = await getVisitor(visitorCookie.value)
  if (!visitor) {
    // Cookie exists but visitor not found, redirect to register
    redirect(`/register?redirect=/visit/booth/${params.hashcode}`)
  }

  // Log the visit
  const result = await logVisit(
    visitor.id,
    booth.id,
    null, // IP address - would need request object
    null  // User agent - would need request object
  )

  if (!result.success && result.error === 'already_visited') {
    // Already visited this booth
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Sudah Dilawati / Already Visited
            </h1>
            <p className="text-lg text-gray-700 mb-2">
              Anda sudah melawati gerai ini sebelum ini.
            </p>
            <p className="text-lg text-gray-700 mb-6">
              You have already visited this booth before.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600">
                <strong>Gerai / Booth:</strong> {booth.boothName}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Agensi / Agency:</strong> {booth.agency}
              </p>
            </div>
            <a
              href="/"
              className="inline-block px-6 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-900 transition-colors"
            >
              Kembali ke Halaman Utama / Back to Home
            </a>
          </div>
        </div>
      </div>
    )
  }

  // Success! Show success page
  return <VisitSuccess visit={result.visit!} />
}
