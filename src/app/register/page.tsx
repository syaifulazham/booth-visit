'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get('redirect')
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    state: '',
    gender: '',
    age: '',
    visitorType: '',
    sektor: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const states = [
    'JOHOR',
    'KEDAH',
    'KELANTAN',
    'MELAKA',
    'NEGERI SEMBILAN',
    'PAHANG',
    'PULAU PINANG',
    'PERAK',
    'PERLIS',
    'SELANGOR',
    'TERENGGANU',
    'SABAH',
    'SARAWAK',
    'WP KUALA LUMPUR',
    'WP LABUAN',
    'WP PUTRAJAYA',
  ]

  const visitorTypes = [
    'Awam / Public',
    'Kakitangan Kerajaan / Government Employee',
    'Kakitangan Swasta / Private Employee',
    'Pelajar / Student',
    'Pensyarah/Guru / Lecturer/Teacher',
    'Lain-lain / Others',
  ]

  const sektors = [
    'Pertanian / Agriculture',
    'Penternakan / Livestock',
    'Perindustrian / Industrial',
    'Automotif / Automotive',
    'Teknologi / Technology',
    'Pendidikan / Education',
    'Kesihatan / Healthcare',
    'Lain-lain / Others',
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: '',
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Nama penuh diperlukan / Full name is required'
    }
    if (!formData.state) {
      newErrors.state = 'Sila pilih negeri / Please select state'
    }
    if (!formData.gender) {
      newErrors.gender = 'Sila pilih jantina / Please select gender'
    }
    const age = parseInt(formData.age)
    if (!formData.age || isNaN(age) || age < 1 || age > 120) {
      newErrors.age = 'Umur tidak sah (1-120) / Invalid age (1-120)'
    }
    if (!formData.visitorType) {
      newErrors.visitorType = 'Sila pilih jenis pelawat / Please select visitor type'
    }
    if (!formData.sektor) {
      newErrors.sektor = 'Sila pilih sektor / Please select sector'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/visitors/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          age: parseInt(formData.age),
          // Extract the English part for database (before the /)
          visitorType: formData.visitorType.split(' / ')[0],
          sektor: formData.sektor.split(' / ')[0],
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrors({ form: data.error || 'Ralat tidak dijangka / Unexpected error' })
        return
      }

      // Redirect to the booth visit page or homepage
      if (redirectUrl) {
        router.push(redirectUrl)
      } else {
        router.push('/?registered=true')
      }
    } catch (err) {
      setErrors({ form: 'Ralat rangkaian / Network error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center space-y-2">
            <div className="text-4xl mb-2">🏢</div>
            <CardTitle className="text-3xl font-bold">
              MOSTI STEM & AI Showcase
            </CardTitle>
            <p className="text-xl text-gray-700">
              Pendaftaran Pelawat / Visitor Registration
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  Nama Penuh / Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">
                  No. Telefon / Phone Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={loading}
                  className={errors.phone ? 'border-red-500' : ''}
                  placeholder="01X-XXXXXXX"
                />
                {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">
                  Emel / Email (Optional)
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  className={errors.email ? 'border-red-500' : ''}
                  placeholder="email@example.com"
                />
                {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
              </div>

              {/* State */}
              <div className="space-y-2">
                <Label htmlFor="state">
                  Negeri / State <span className="text-red-500">*</span>
                </Label>
                <select
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  disabled={loading}
                  className={`flex h-10 w-full rounded-md border ${
                    errors.state ? 'border-red-500' : 'border-input'
                  } bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  <option value="">Sila Pilih / Please Select</option>
                  {states.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                {errors.state && <p className="text-sm text-red-600">{errors.state}</p>}
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <Label>
                  Jantina / Gender <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-6">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="Lelaki"
                      checked={formData.gender === 'Lelaki'}
                      onChange={handleChange}
                      disabled={loading}
                      className="w-4 h-4"
                    />
                    <span>Lelaki / Male</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="Perempuan"
                      checked={formData.gender === 'Perempuan'}
                      onChange={handleChange}
                      disabled={loading}
                      className="w-4 h-4"
                    />
                    <span>Perempuan / Female</span>
                  </label>
                </div>
                {errors.gender && <p className="text-sm text-red-600">{errors.gender}</p>}
              </div>

              {/* Age */}
              <div className="space-y-2">
                <Label htmlFor="age">
                  Umur / Age <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  min="1"
                  max="120"
                  value={formData.age}
                  onChange={handleChange}
                  disabled={loading}
                  className={errors.age ? 'border-red-500' : ''}
                  placeholder="tahun / years old"
                />
                {errors.age && <p className="text-sm text-red-600">{errors.age}</p>}
              </div>

              {/* Visitor Type */}
              <div className="space-y-2">
                <Label htmlFor="visitorType">
                  Jenis Pelawat / Visitor Type <span className="text-red-500">*</span>
                </Label>
                <select
                  id="visitorType"
                  name="visitorType"
                  value={formData.visitorType}
                  onChange={handleChange}
                  disabled={loading}
                  className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    errors.visitorType ? 'border-red-500' : ''
                  }`}
                >
                  <option value="">Sila Pilih / Please Select</option>
                  {visitorTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.visitorType && <p className="text-sm text-red-600">{errors.visitorType}</p>}
              </div>

              {/* Sector */}
              <div className="space-y-2">
                <Label htmlFor="sektor">
                  Sektor / Sector <span className="text-red-500">*</span>
                </Label>
                <select
                  id="sektor"
                  name="sektor"
                  value={formData.sektor}
                  onChange={handleChange}
                  disabled={loading}
                  className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    errors.sektor ? 'border-red-500' : ''
                  }`}
                >
                  <option value="">Sila Pilih / Please Select</option>
                  {sektors.map((sektor) => (
                    <option key={sektor} value={sektor}>
                      {sektor}
                    </option>
                  ))}
                </select>
                {errors.sektor && <p className="text-sm text-red-600">{errors.sektor}</p>}
              </div>

              {/* Form Error */}
              {errors.form && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                  {errors.form}
                </div>
              )}

              {/* Submit Button */}
              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? 'Mendaftar... / Registering...' : 'Daftar / Register'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              <a href="/" className="hover:underline">
                ← Kembali ke Halaman Utama / Back to Home
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  )
}
