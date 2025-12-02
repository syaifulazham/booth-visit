'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

interface RatingFormProps {
  visitId: string
  initialRating?: number | null
  initialComment?: string | null
  onSubmitSuccess?: () => void
}

export function RatingForm({ visitId, initialRating, initialComment, onSubmitSuccess }: RatingFormProps) {
  const [rating, setRating] = useState<number>(initialRating || 0)
  const [hoverRating, setHoverRating] = useState<number>(0)
  const [comment, setComment] = useState(initialComment || '')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (rating === 0) {
      setError('Sila pilih rating / Please select a rating')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/visits/rate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          visitId,
          rating,
          comment: comment.trim() || null,
        }),
      })

      if (response.ok) {
        setSubmitted(true)
        onSubmitSuccess?.()
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to submit rating')
      }
    } catch (err) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div className="text-4xl mb-2">✅</div>
        <h3 className="text-lg font-semibold text-green-900 mb-1">
          Terima Kasih! / Thank You!
        </h3>
        <p className="text-sm text-green-700">
          Penilaian anda telah dihantar / Your rating has been submitted
        </p>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 sm:p-6 border border-blue-200">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 text-center">
        Nilaikan Gerai Ini / Rate This Booth
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star Rating */}
        <div className="space-y-2">
          <Label className="text-sm text-gray-700">
            Rating <span className="text-red-500">*</span>
          </Label>
          <div className="flex justify-center gap-2 sm:gap-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-transform hover:scale-110 active:scale-95 focus:outline-none"
                disabled={loading}
              >
                <Star
                  className={`h-8 w-8 sm:h-10 sm:w-10 ${
                    star <= (hoverRating || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-center text-sm text-gray-600 mt-2">
              {rating === 5 && '⭐ Sangat Baik! / Excellent!'}
              {rating === 4 && '⭐ Baik! / Good!'}
              {rating === 3 && '⭐ Sederhana / Average'}
              {rating === 2 && '⭐ Kurang Baik / Poor'}
              {rating === 1 && '⭐ Sangat Kurang / Very Poor'}
            </p>
          )}
        </div>

        {/* Comment */}
        <div className="space-y-2">
          <Label htmlFor="comment" className="text-sm text-gray-700">
            Komen / Comment (Optional)
          </Label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm sm:text-base"
            rows={3}
            placeholder="Kongsi pengalaman anda... / Share your experience..."
            maxLength={500}
          />
          <p className="text-xs text-gray-500 text-right">
            {comment.length}/500
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-sm text-red-600 text-center">{error}</p>
        )}

        {/* Submit Button */}
        <div className="flex gap-2 sm:gap-3">
          <Button
            type="submit"
            disabled={loading || rating === 0}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? 'Menghantar... / Submitting...' : 'Hantar / Submit'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setSubmitted(true)
              onSubmitSuccess?.()
            }}
            className="flex-1"
          >
            Langkau / Skip
          </Button>
        </div>
      </form>
    </div>
  )
}
