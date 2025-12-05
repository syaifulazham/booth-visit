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
    if (!formData.email.trim()) {
      newErrors.email = 'Emel diperlukan / Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Emel tidak sah / Invalid email format'
    }
    if (!formData.gender) {
      newErrors.gender = 'Sila pilih jantina / Please select gender'
    }

    // Optional field validations
    if (formData.age) {
      const age = parseInt(formData.age)
      if (isNaN(age) || age < 1 || age > 120) {
        newErrors.age = 'Umur tidak sah (1-120) / Invalid age (1-120)'
      }
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
          name: formData.name,
          email: formData.email,
          gender: formData.gender,
          // Optional fields - only include if provided
          phone: formData.phone || undefined,
          state: formData.state || undefined,
          age: formData.age ? parseInt(formData.age) : undefined,
          visitorType: formData.visitorType ? formData.visitorType.split(' / ')[0] : undefined,
          sektor: formData.sektor ? formData.sektor.split(' / ')[0] : undefined,
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
            {/* Info Message */}
            <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">ℹ️ Quick Registration:</span> Only 3 fields needed! 
                Additional details (phone, state, age, etc.) can be added later in your profile.
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Pendaftaran Pantas: Hanya 3 medan diperlukan! 
                Maklumat tambahan (telefon, negeri, umur, dll.) boleh ditambah kemudian di profil anda.
              </p>
            </div>

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
                  placeholder="Ahmad Ibrahim"
                />
                {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">
                  Emel / Email <span className="text-red-500">*</span>
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

              {/* Gender */}
              <div className="space-y-2">
                <Label>
                  Jantina / Gender <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, gender: 'Lelaki' })
                      if (errors.gender) setErrors({ ...errors, gender: '' })
                    }}
                    disabled={loading}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                      formData.gender === 'Lelaki'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <span className="text-xl pointer-events-none">👨</span>
                    <span className="pointer-events-none">Lelaki / Male</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, gender: 'Perempuan' })
                      if (errors.gender) setErrors({ ...errors, gender: '' })
                    }}
                    disabled={loading}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                      formData.gender === 'Perempuan'
                        ? 'bg-pink-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <span className="text-xl pointer-events-none">👩</span>
                    <span className="pointer-events-none">Perempuan / Female</span>
                  </button>
                </div>
                {errors.gender && <p className="text-sm text-red-600">{errors.gender}</p>}
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
