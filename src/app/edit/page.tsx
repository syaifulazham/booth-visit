'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

export default function EditProfilePage() {
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gender: '',
    phone: '',
    state: '',
    age: '',
    visitorType: '',
    sektor: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [fetchingData, setFetchingData] = useState(true)

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

  useEffect(() => {
    fetchVisitorData()
  }, [])

  const fetchVisitorData = async () => {
    try {
      const response = await fetch('/api/visitors/me')
      if (response.ok) {
        const data = await response.json()
        setFormData({
          name: data.visitor.name || '',
          email: data.visitor.email || '',
          gender: data.visitor.gender || '',
          phone: data.visitor.phone || '',
          state: data.visitor.state || '',
          age: data.visitor.age?.toString() || '',
          visitorType: data.visitor.visitorType ? `${data.visitor.visitorType} / ${getEnglishType(data.visitor.visitorType)}` : '',
          sektor: data.visitor.sektor ? `${data.visitor.sektor} / ${getEnglishSector(data.visitor.sektor)}` : '',
        })
      } else {
        // No visitor data, redirect to register
        router.push('/register')
      }
    } catch (error) {
      console.error('Error fetching visitor data:', error)
    } finally {
      setFetchingData(false)
    }
  }

  const getEnglishType = (type: string) => {
    const typeMap: Record<string, string> = {
      'Awam': 'Public',
      'Kakitangan Kerajaan': 'Government Employee',
      'Kakitangan Swasta': 'Private Employee',
      'Pelajar': 'Student',
      'Pensyarah/Guru': 'Lecturer/Teacher',
      'Lain-lain': 'Others',
    }
    return typeMap[type] || type
  }

  const getEnglishSector = (sector: string) => {
    const sectorMap: Record<string, string> = {
      'Pertanian': 'Agriculture',
      'Penternakan': 'Livestock',
      'Perindustrian': 'Industrial',
      'Automotif': 'Automotive',
      'Teknologi': 'Technology',
      'Pendidikan': 'Education',
      'Kesihatan': 'Healthcare',
      'Lain-lain': 'Others',
    }
    return sectorMap[sector] || sector
  }

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
    if (formData.phone && (formData.phone.length < 10 || formData.phone.length > 15)) {
      newErrors.phone = 'No. telefon tidak sah / Invalid phone number'
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
      const response = await fetch('/api/visitors/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          gender: formData.gender,
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

      // Redirect to home with success message
      router.push('/?updated=true')
    } catch (err) {
      setErrors({ form: 'Ralat rangkaian / Network error' })
    } finally {
      setLoading(false)
    }
  }

  if (fetchingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center space-y-2">
            <div className="text-4xl mb-2">✏️</div>
            <CardTitle className="text-3xl font-bold">
              Edit Profil / Edit Profile
            </CardTitle>
            <p className="text-base text-gray-600">
              Kemaskini maklumat anda / Update your information
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

              {/* Divider */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Maklumat Tambahan / Additional Information
                </h3>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">
                  No. Telefon / Phone Number (Optional)
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

              {/* State */}
              <div className="space-y-2">
                <Label htmlFor="state">
                  Negeri / State (Optional)
                </Label>
                <select
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  disabled={loading}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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

              {/* Age */}
              <div className="space-y-2">
                <Label htmlFor="age">
                  Umur / Age (Optional)
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
                  Jenis Pelawat / Visitor Type (Optional)
                </Label>
                <select
                  id="visitorType"
                  name="visitorType"
                  value={formData.visitorType}
                  onChange={handleChange}
                  disabled={loading}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                  Sektor / Sector (Optional)
                </Label>
                <select
                  id="sektor"
                  name="sektor"
                  value={formData.sektor}
                  onChange={handleChange}
                  disabled={loading}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
              <div className="flex gap-3">
                <Link href="/" className="flex-1">
                  <Button type="button" variant="outline" className="w-full" size="lg">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Batal / Cancel
                  </Button>
                </Link>
                <Button type="submit" className="flex-1" size="lg" disabled={loading}>
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Menyimpan... / Saving...' : 'Simpan / Save'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
