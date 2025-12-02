'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function EditBoothPage({ params }: { params: { id: string } }) {
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
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchBooth = async () => {
      try {
        const response = await fetch(`/api/admin/booths/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setFormData({
            boothNumber: data.booth.boothNumber || '',
            boothName: data.booth.boothName,
            ministry: data.booth.ministry,
            agency: data.booth.agency,
            abbreviationName: data.booth.abbreviationName,
            picName: data.booth.picName || '',
            picPhone: data.booth.picPhone || '',
            picEmail: data.booth.picEmail || '',
          })
        } else {
          setErrors({ form: 'Failed to load booth' })
        }
      } catch (error) {
        setErrors({ form: 'Network error' })
      } finally {
        setLoading(false)
      }
    }

    fetchBooth()
  }, [params.id])

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
    setSaving(true)
    setErrors({})

    try {
      const response = await fetch(`/api/admin/booths/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrors({ form: data.error || 'Failed to update booth' })
        return
      }

      router.push('/admin/booths')
      router.refresh()
    } catch (error) {
      setErrors({ form: 'Network error' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">Loading...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Edit Booth</CardTitle>
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
                disabled={saving}
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
                disabled={saving}
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
                disabled={saving}
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
                disabled={saving}
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
                disabled={saving}
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
                    disabled={saving}
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
                    disabled={saving}
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
                    disabled={saving}
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
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={saving}
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
