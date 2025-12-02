'use client'

import { useState } from 'react'
import { RatingForm } from './RatingForm'

interface VisitSuccessProps {
  visit: {
    id: string
    visitor: {
      name: string
    }
    booth: {
      boothName: string
      agency: string
      ministry: string
    }
    visitedAt: Date
  }
}

export function VisitSuccess({ visit }: VisitSuccessProps) {
  const [showRating, setShowRating] = useState(true)
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* Success Icon */}
          <div className="text-6xl mb-4">✅</div>
          
          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Selamat Datang! / Welcome!
          </h1>
          
          {/* Welcome message */}
          <p className="text-xl text-blue-600 font-semibold mb-2">
            {visit.visitor.name}
          </p>
          <p className="text-lg text-gray-700 mb-6">
            Terima kasih kerana melawati gerai kami!
            <br />
            Thank you for visiting our booth!
          </p>

          {/* Booth Details */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Gerai / Booth</p>
                <p className="text-xl font-bold text-gray-900">{visit.booth.boothName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Agensi / Agency</p>
                <p className="text-lg text-gray-900">{visit.booth.agency}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Kementerian / Ministry</p>
                <p className="text-lg text-gray-900">{visit.booth.ministry}</p>
              </div>
            </div>
          </div>

          {/* Visitor Info */}
          <div className="border-t pt-6 mb-6">
            <p className="text-sm text-gray-600">Pelawat / Visitor</p>
            <p className="text-lg font-semibold text-gray-900">{visit.visitor.name}</p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(visit.visitedAt).toLocaleString('en-MY', {
                dateStyle: 'long',
                timeStyle: 'short',
              })}
            </p>
          </div>

          {/* Rating Form */}
          {showRating && (
            <div className="border-t pt-6 mb-6">
              <RatingForm 
                visitId={visit.id} 
                onSubmitSuccess={() => setShowRating(false)}
              />
            </div>
          )}

          {/* Divider */}
          {!showRating && (
            <div className="border-t pt-6 mb-6">
              <p className="text-gray-600 mb-2">
                Lawati gerai lain untuk pengalaman yang lebih hebat!
              </p>
              <p className="text-gray-600">
                Visit other booths for more amazing experiences!
              </p>
            </div>
          )}

          {/* Back Button */}
          <a
            href="/"
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Kembali ke Halaman Utama / Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}
