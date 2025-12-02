'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Building2 } from 'lucide-react'

type Booth = {
  id: string
  boothNumber: string | null
  boothName: string
  agency: string
  ministry: string
  abbreviationName: string
}

export default function AllBoothsPage() {
  const [booths, setBooths] = useState<Booth[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBooths() {
      try {
        const response = await fetch('/api/booths/public')
        if (response.ok) {
          const data = await response.json()
          setBooths(data.booths)
        }
      } catch (error) {
        console.error('Error fetching booths:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchBooths()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-6 sm:py-12 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm sm:text-base"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali / Back</span>
        </Link>

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            🏢 Semua Gerai / All Booths
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Senarai gerai di MOSTI STEM & AI Showcase
            <br />
            List of booths at MOSTI STEM & AI Showcase
          </p>
        </div>

        {/* Booths List */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl flex items-center justify-between">
              <span>Senarai Gerai / Booth List</span>
              <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                {booths.length} gerai
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {booths.length > 0 ? (
              <div className="space-y-3">
                {booths.map((booth) => (
                  <div
                    key={booth.id}
                    className="p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 flex-shrink-0 mt-1" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base break-words">
                            {booth.boothName}
                          </h3>
                          {booth.boothNumber && (
                            <span className="text-xs font-mono bg-blue-100 text-blue-700 px-2 py-1 rounded flex-shrink-0">
                              {booth.boothNumber}
                            </span>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 break-words">
                          {booth.agency}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {booth.ministry}
                        </p>
                        <p className="text-xs text-blue-600 font-medium mt-2">
                          {booth.abbreviationName}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  Tiada gerai tersedia
                  <br />
                  <span className="text-sm">No booths available</span>
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center pb-4">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm sm:text-base shadow-md"
          >
            Kembali ke Halaman Utama / Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}
