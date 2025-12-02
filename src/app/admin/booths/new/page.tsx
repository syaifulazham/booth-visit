'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function NewBoothPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    boothNumber: '',
    boothName: '',
    ministry: '',
    agency: '',
    abbreviationName: '',
    picName: '',
    picPhone: '',
    picEmail: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      const response = await fetch('/api/admin/booths', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrors({ form: data.error || 'Failed to create booth' })
        return
      }

      router.push('/admin/booths')
      router.refresh()
    } catch (error) {
      setErrors({ form: 'Network error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Create New Booth</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="boothNumber">
                Booth Number (Optional)
              </Label>
              <Input
                id="boothNumber"
                name="boothNumber"
                value={formData.boothNumber}
                onChange={handleChange}
                disabled={loading}
                placeholder="e.g., B-01, A-23"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="boothName">
                Booth Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="boothName"
                name="boothName"
                value={formData.boothName}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ministry">
                Ministry <span className="text-red-500">*</span>
              </Label>
              <Input
                id="ministry"
                name="ministry"
                value={formData.ministry}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="agency">
                Agency <span className="text-red-500">*</span>
              </Label>
              <Input
                id="agency"
                name="agency"
                value={formData.agency}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="abbreviationName">
                Abbreviation Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="abbreviationName"
                name="abbreviationName"
                value={formData.abbreviationName}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="border-t pt-4 mt-4">
              <h3 className="font-medium mb-4">Person In Charge (Optional)</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="picName">PIC Name</Label>
                  <Input
                    id="picName"
                    name="picName"
                    value={formData.picName}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="picPhone">PIC Phone</Label>
                  <Input
                    id="picPhone"
                    name="picPhone"
                    type="tel"
                    value={formData.picPhone}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="picEmail">PIC Email</Label>
                  <Input
                    id="picEmail"
                    name="picEmail"
                    type="email"
                    value={formData.picEmail}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {errors.form && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                {errors.form}
              </div>
            )}

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Booth'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
