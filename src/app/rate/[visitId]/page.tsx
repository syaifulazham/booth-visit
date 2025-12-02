'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RatingForm } from '@/components/visitor/RatingForm'
import { ArrowLeft } from 'lucide-react'

type Visit = {
  id: string
  rating: number | null
  comment: string | null
  booth: {
    boothName: string
    agency: string
    ministry: string
  }
  visitedAt: Date
}

export default function RatingPage({ params }: { params: { visitId: string } }) {
  const [visit, setVisit] = useState<Visit | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    async function fetchVisit() {
      try {
        const response = await fetch(`/api/visits/${params.visitId}`)
        if (response.ok) {
          const data = await response.json()
          setVisit(data.visit)
        } else {
          setError('Visit not found')
        }
      } catch (err) {
        setError('Error loading visit')
      } finally {
        setLoading(false)
      }
    }
    fetchVisit()
  }, [params.visitId])

  const handleRatingSuccess = () => {
    setTimeout(() => {
      router.push('/')
    }, 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (error || !visit) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white shadow-lg">
            <CardContent className="pt-6 text-center">
              <p className="text-red-600 mb-4">{error || 'Visit not found'}</p>
              <Link
                href="/"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Kembali ke Halaman Utama / Back to Home
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-6 sm:py-12 px-3 sm:px-4">
      <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm sm:text-base"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali / Back</span>
        </Link>

        {/* Booth Info Card */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">
              {visit.rating ? 'Edit Rating / Kemaskini Penilaian' : 'Rate Booth / Nilaikan Gerai'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Booth Details */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-2">
                {visit.booth.boothName}
              </h3>
              <p className="text-sm text-gray-600">{visit.booth.agency}</p>
              <p className="text-xs text-gray-500 mt-1">{visit.booth.ministry}</p>
              <p className="text-xs text-gray-500 mt-2">
                Visited: {new Date(visit.visitedAt).toLocaleString('en-MY', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </p>
            </div>

            {/* Current Rating Display */}
            {visit.rating && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Current Rating / Penilaian Semasa:
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    {'⭐'.repeat(visit.rating)}
                  </span>
                  <span className="text-lg font-semibold text-gray-900">
                    {visit.rating}/5
                  </span>
                </div>
                {visit.comment && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-600 mb-1">Comment:</p>
                    <p className="text-sm text-gray-800 italic">"{visit.comment}"</p>
                  </div>
                )}
              </div>
            )}

            {/* Rating Form */}
            <RatingForm
              visitId={visit.id}
              initialRating={visit.rating}
              initialComment={visit.comment}
              onSubmitSuccess={handleRatingSuccess}
            />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
