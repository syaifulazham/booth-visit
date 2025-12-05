'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { QRScanner } from '@/components/visitor/QRScanner'
import { QrCode, UserPlus, Award, X, HelpCircle, Edit } from 'lucide-react'
import { Roboto } from 'next/font/google'

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
})

type VisitorData = {
  id: string
  name: string
  phone: string
  email: string | null
  visits: Array<{
    id: string
    visitedAt: Date
    rating: number | null
    comment: string | null
    booth: {
      boothName: string
      agency: string
      ministry: string
    }
  }>
} | null

export default function Home() {
  const [visitor, setVisitor] = useState<VisitorData>(null)
  const [loading, setLoading] = useState(true)
  const [showScanner, setShowScanner] = useState(false)
  const [totalBooths, setTotalBooths] = useState(0)
  const [eventName, setEventName] = useState('MOSTI STEM & AI Showcase')
  const [eventSlogan, setEventSlogan] = useState('')
  const [showCertModal, setShowCertModal] = useState(false)
  const [selectedCert, setSelectedCert] = useState<{
    name: string
    level: string
    color: string
    percentage: number
  } | null>(null)

  useEffect(() => {
    async function fetchVisitorData() {
      try {
        const response = await fetch('/api/visitor/me')
        if (response.ok) {
          const data = await response.json()
          setVisitor(data.visitor)
          setTotalBooths(data.totalBooths || 0)
        }
      } catch (error) {
        console.error('Error fetching visitor data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    async function fetchEventData() {
      try {
        const response = await fetch('/api/event/public')
        if (response.ok) {
          const data = await response.json()
          if (data.event?.name) {
            setEventName(data.event.name)
            // Update page title
            document.title = data.event.name
          }
          if (data.event?.slogan) {
            setEventSlogan(data.event.slogan)
          }
        }
      } catch (error) {
        console.error('Error fetching event data:', error)
      }
    }
    
    fetchVisitorData()
    fetchEventData()
  }, [])

  // Calculate achievements
  const getAchievements = () => {
    if (!visitor || totalBooths === 0) return []

    const visitedCount = visitor.visits.length
    const achievements = []

    // Bronze - 1/4 (25%)
    if (visitedCount >= Math.ceil(totalBooths / 4)) {
      achievements.push({
        name: 'Bronze Explorer',
        nameMs: 'Penjelajah Gangsa',
        level: 'Bronze',
        color: 'from-amber-700 to-amber-900',
        textColor: 'text-amber-700',
        bgColor: 'bg-gradient-to-br from-amber-50 to-amber-100',
        percentage: 25,
        required: Math.ceil(totalBooths / 4),
      })
    }

    // Silver - 1/2 (50%)
    if (visitedCount >= Math.ceil(totalBooths / 2)) {
      achievements.push({
        name: 'Silver Pioneer',
        nameMs: 'Perintis Perak',
        level: 'Silver',
        color: 'from-gray-400 to-gray-600',
        textColor: 'text-gray-600',
        bgColor: 'bg-gradient-to-br from-gray-50 to-gray-200',
        percentage: 50,
        required: Math.ceil(totalBooths / 2),
      })
    }

    // Gold - 3/4 (75%)
    if (visitedCount >= Math.ceil((totalBooths * 3) / 4)) {
      achievements.push({
        name: 'Gold Champion',
        nameMs: 'Juara Emas',
        level: 'Gold',
        color: 'from-yellow-400 to-yellow-600',
        textColor: 'text-yellow-600',
        bgColor: 'bg-gradient-to-br from-yellow-50 to-yellow-100',
        percentage: 75,
        required: Math.ceil((totalBooths * 3) / 4),
      })
    }

    // Platinum - 4/5 (80%)
    if (visitedCount >= Math.ceil((totalBooths * 4) / 5)) {
      achievements.push({
        name: 'Platinum Master',
        nameMs: 'Sarjana Platinum',
        level: 'Platinum',
        color: 'from-cyan-400 to-blue-600',
        textColor: 'text-blue-600',
        bgColor: 'bg-gradient-to-br from-cyan-50 to-blue-100',
        percentage: 80,
        required: Math.ceil((totalBooths * 4) / 5),
      })
    }

    return achievements
  }

  const achievements = getAchievements()

  const handleCertClick = (achievement: any) => {
    setSelectedCert({
      name: achievement.name,
      level: achievement.level,
      color: achievement.color,
      percentage: achievement.percentage,
    })
    setShowCertModal(true)
  }

  return (
    <>
      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #certificate-print-area,
          #certificate-print-area * {
            visibility: visible;
          }
          #certificate-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .print-hide {
            display: none !important;
          }
          @page {
            margin: 1cm;
          }
        }
      `}</style>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-6 sm:py-12 px-3 sm:px-4">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 sm:space-y-6">
          {/* Logo */}
          <div className="flex items-center justify-center">
            <div className="relative w-24 h-16 sm:w-36 sm:h-24">
              <Image
                src="/images/logo/madani.png"
                alt="Madani Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
          
          {/* Event Title */}
          <div>
            <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 ${roboto.className}`}>
              {eventName}
            </h1>
            {eventSlogan && (
              <p className={`text-xl sm:text-2xl text-blue-600 font-medium mt-2 italic ${roboto.className}`}>
                {eventSlogan}
              </p>
            )}
            <p className="text-lg sm:text-xl text-gray-600 mt-3">
              Booth Visit Log Book System
            </p>
            <p className="text-base sm:text-lg text-gray-500">
              Sistem Buku Log Lawatan Gerai
            </p>
          </div>
        </div>

        {/* QR Scanner Card - Shown for returning visitors */}
        {visitor && (
          <Card className="bg-white shadow-lg">
            <CardContent className="pt-6 pb-6">
              <div className="flex flex-row items-stretch justify-center gap-3">
                <button
                  onClick={() => setShowScanner(true)}
                  className="inline-flex items-center justify-center gap-2 px-4 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 active:bg-blue-800 transition-colors text-sm sm:text-base shadow-md hover:shadow-lg flex-1 sm:flex-initial"
                >
                  <QrCode className="h-5 w-5" />
                  <span>Imbas QR Kod Gerai / Scan Booth QR</span>
                </button>
                <Link
                  href="/guide"
                  className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-4 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors shadow-md hover:shadow-lg text-sm sm:text-base"
                  title="Panduan Penggunaan / User Guide"
                >
                  <HelpCircle className="h-5 w-5" />
                  <span>Panduan / Guide</span>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Achievements Card - Shown for visitors with progress */}
        {visitor && achievements.length > 0 && (
          <Card className="bg-white shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Award className="h-5 w-5 text-yellow-500" />
                Pencapaian / Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {achievements.map((achievement, index) => (
                  <button
                    key={index}
                    onClick={() => handleCertClick(achievement)}
                    className={`${achievement.bgColor} p-4 rounded-lg hover:scale-105 transition-transform shadow-md hover:shadow-lg cursor-pointer`}
                  >
                    <div className="flex flex-col items-center text-center space-y-2">
                      <Award className={`h-8 w-8 sm:h-10 sm:w-10 ${achievement.textColor}`} />
                      <div>
                        <p className={`text-sm sm:text-base font-bold ${achievement.textColor}`}>
                          {achievement.level}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {achievement.nameMs}
                        </p>
                        <p className="text-xs text-gray-500">
                          {achievement.percentage}%
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 text-center mt-3">
                Klik sijil untuk melihat / Click certificate to view
              </p>
            </CardContent>
          </Card>
        )}

        {/* Statistics Card */}
        <Card className="bg-white shadow-lg">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Total Booths */}
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                <p className="text-3xl sm:text-4xl font-bold text-blue-600 mb-1">
                  {totalBooths}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">
                  Jumlah Gerai
                  <br />
                  <span className="text-xs">Total Booths</span>
                </p>
              </div>

              {/* Visited Booths */}
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                <p className="text-3xl sm:text-4xl font-bold text-green-600 mb-1">
                  {visitor ? visitor.visits.length : 0}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">
                  Gerai Dilawati
                  <br />
                  <span className="text-xs">Booths Visited</span>
                </p>
              </div>
            </div>

            {/* View All Booths Button */}
            <Link
              href="/booths"
              className="block w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all text-center text-sm sm:text-base shadow-md hover:shadow-lg"
            >
              📋 Lihat Semua Gerai / View All Booths
            </Link>
          </CardContent>
        </Card>

        {/* Visitor Welcome Section */}
        {visitor && (
          <Card className="bg-white shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <CardTitle className="text-lg sm:text-xl md:text-2xl leading-tight">
                  Selamat Datang / Welcome
                  <br />
                  <span className="text-blue-600">{visitor.name}! 👋</span>
                </CardTitle>
                <Link
                  href="/edit"
                  className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit Profil / Edit Profile"
                >
                  <Edit className="w-4 h-4" />
                  <span className="hidden sm:inline">Edit</span>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Contact Info */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                {visitor.phone && (
                  <span className="flex items-center gap-1">
                    <span className="text-base">📱</span>
                    <span className="break-all">{visitor.phone}</span>
                  </span>
                )}
                {visitor.email && (
                  <span className="flex items-center gap-1">
                    <span className="text-base">📧</span>
                    <span className="break-all">{visitor.email}</span>
                  </span>
                )}
                {!visitor.phone && !visitor.email && (
                  <span className="text-gray-500 italic">
                    Tiada maklumat tambahan / No additional information
                  </span>
                )}
              </div>
              
              {/* Visited Booths List */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-3 flex items-center justify-between">
                  <span>Gerai Dilawati / Visited Booths</span>
                  <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                    {visitor.visits.length}
                  </span>
                </h3>
                
                {visitor.visits.length > 0 ? (
                  <div className="space-y-3">
                    {visitor.visits.map((visit) => (
                      <div
                        key={visit.id}
                        className="p-3 sm:p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 sm:gap-4">
                          {/* Left Column: Booth Info */}
                          <div className="flex items-start gap-2">
                            <span className="text-xl sm:text-2xl flex-shrink-0">✅</span>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 text-sm sm:text-base break-words">
                                {visit.booth.boothName}
                              </h4>
                              <p className="text-xs sm:text-sm text-gray-600 break-words mt-1">
                                {visit.booth.agency}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(visit.visitedAt).toLocaleString('en-MY', {
                                  dateStyle: 'medium',
                                  timeStyle: 'short',
                                })}
                              </p>
                            </div>
                          </div>
                          
                          {/* Right Column: Rating & Button */}
                          <div className="flex flex-col items-start sm:items-end justify-center gap-2 sm:pl-4 border-t sm:border-t-0 sm:border-l border-green-300 pt-3 sm:pt-0">
                            {/* Rating Display */}
                            {visit.rating ? (
                              <div className="flex items-center gap-2">
                                <span className="text-sm">
                                  {'⭐'.repeat(visit.rating)}
                                </span>
                                <span className="text-xs text-gray-600">
                                  ({visit.rating}/5)
                                </span>
                              </div>
                            ) : (
                              <p className="text-xs text-gray-500 italic">
                                Belum dinilai / Not rated
                              </p>
                            )}
                            
                            {/* Rating Button */}
                            <Link
                              href={`/rate/${visit.id}`}
                              className="inline-flex items-center gap-1 text-xs sm:text-sm px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap"
                            >
                              <span>{visit.rating ? '✏️ Edit Rating' : '⭐ Rate Booth'}</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 px-4">
                    <p className="text-4xl mb-2">📋</p>
                    <p className="text-gray-500 text-sm sm:text-base">
                      Belum melawati mana-mana gerai
                      <br />
                      <span className="text-xs sm:text-sm">No booths visited yet</span>
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Button - For New Visitors Only */}
        {!visitor && (
          <div className="flex flex-row items-stretch justify-center gap-3 px-2 sm:px-0">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-4 sm:py-5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 active:bg-blue-800 transition-colors text-base sm:text-lg shadow-lg hover:shadow-xl flex-1 sm:flex-initial"
            >
              <UserPlus className="h-5 w-5 sm:h-6 sm:w-6" />
              <span>Pelawat Baru / New Visitor</span>
            </Link>
            <Link
              href="/guide"
              className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-4 sm:py-5 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors shadow-lg hover:shadow-xl text-base sm:text-lg"
              title="Panduan Penggunaan / User Guide"
            >
              <HelpCircle className="h-5 w-5 sm:h-6 sm:w-6" />
              <span>Panduan / Guide</span>
            </Link>
          </div>
        )}
        
        {/* QR Scanner Modal */}
        {showScanner && <QRScanner onClose={() => setShowScanner(false)} />}

        {/* E-Certificate Modal */}
        {showCertModal && selectedCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Close Button */}
              <div className="flex justify-end p-4 print-hide">
                <button
                  onClick={() => setShowCertModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-6 w-6 text-gray-600" />
                </button>
              </div>

              {/* Certificate Content */}
              <div id="certificate-print-area" className={`bg-gradient-to-br ${selectedCert.color} p-8 sm:p-12 mx-4 sm:mx-8 mb-8 rounded-lg border-8 border-double border-white shadow-xl`}>
                <div className="bg-white bg-opacity-95 p-6 sm:p-8 rounded-lg">
                  {/* Certificate Header */}
                  <div className="text-center space-y-4">
                    {/* Logo Area */}
                    <div className="flex items-center justify-center mb-6">
                      <div className="relative w-16 h-12 sm:w-20 sm:h-16">
                        <Image
                          src="/images/logo/madani.png"
                          alt="Madani Logo"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>

                    {/* Certificate Title */}
                    <div className="space-y-2">
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                        SIJIL PENCAPAIAN
                      </h2>
                      <h3 className="text-xl sm:text-2xl font-semibold text-gray-700">
                        CERTIFICATE OF ACHIEVEMENT
                      </h3>
                    </div>

                    {/* Event Name */}
                    <div className={`mt-4 ${roboto.className}`}>
                      <p className="text-lg sm:text-xl font-bold text-gray-800">
                        {eventName}
                      </p>
                      {eventSlogan && (
                        <p className="text-sm sm:text-base text-blue-600 italic mt-1">
                          {eventSlogan}
                        </p>
                      )}
                    </div>

                    {/* Divider */}
                    <div className={`h-1 w-32 mx-auto bg-gradient-to-r ${selectedCert.color} rounded-full`}></div>

                    {/* Achievement Badge */}
                    <div className="py-6">
                      <div className={`inline-block bg-gradient-to-br ${selectedCert.color} p-6 rounded-full mb-4`}>
                        <Award className="h-16 w-16 sm:h-20 sm:w-20 text-white" />
                      </div>
                      <h4 className={`text-3xl sm:text-4xl font-bold bg-gradient-to-r ${selectedCert.color} bg-clip-text text-transparent`}>
                        {selectedCert.level}
                      </h4>
                      <p className="text-lg sm:text-xl text-gray-600 mt-2">
                        {selectedCert.name}
                      </p>
                    </div>

                    {/* Recipient */}
                    <div className="space-y-2">
                      <p className="text-sm sm:text-base text-gray-600">
                        Diberikan kepada / Presented to
                      </p>
                      <p className="text-2xl sm:text-3xl font-bold text-gray-800">
                        {visitor?.name}
                      </p>
                    </div>

                    {/* Achievement Details */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm sm:text-base text-gray-700">
                        Untuk melawati <span className="font-bold">{selectedCert.percentage}%</span> daripada gerai yang tersedia
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">
                        For visiting <span className="font-bold">{selectedCert.percentage}%</span> of available booths
                      </p>
                    </div>

                    {/* Date */}
                    <div className="mt-6 pt-4 border-t border-gray-300">
                      <p className="text-xs sm:text-sm text-gray-500">
                        Tarikh / Date: {new Date().toLocaleDateString('en-MY', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Download Button */}
              <div className="px-8 pb-8 print-hide">
                <button
                  onClick={() => window.print()}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  🖨️ Cetak / Print Certificate
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-xs sm:text-sm text-gray-500 pb-4">
          <p>Powered by MOSTI</p>
        </div>
      </div>
    </main>
    </>
  )
}
