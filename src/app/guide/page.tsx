'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { 
  QrCode, 
  UserPlus, 
  Award, 
  CheckCircle, 
  ArrowRight,
  Home,
  Smartphone,
  Scan,
  Trophy,
  Star,
  MapPin
} from 'lucide-react'
import { Roboto } from 'next/font/google'

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
})

export default function GuidePage() {
  const [eventName, setEventName] = useState('MOSTI STEM & AI Showcase')

  useEffect(() => {
    async function fetchEventData() {
      try {
        const response = await fetch('/api/event/public')
        if (response.ok) {
          const data = await response.json()
          if (data.event?.name) {
            setEventName(data.event.name)
          }
        }
      } catch (error) {
        console.error('Error fetching event data:', error)
      }
    }
    fetchEventData()
  }, [])

  const steps = [
    {
      number: 1,
      icon: <UserPlus className="w-8 h-8 sm:w-10 sm:h-10" />,
      titleMs: 'Daftar Sebagai Pelawat',
      titleEn: 'Register as Visitor',
      descMs: 'Klik butang "Pelawat Baru" di halaman utama. Isi borang pendaftaran dengan maklumat anda.',
      descEn: 'Click "New Visitor" button on the home page. Fill in the registration form with your details.',
      color: 'from-blue-500 to-blue-700',
      bgColor: 'bg-blue-50',
    },
    {
      number: 2,
      icon: <MapPin className="w-8 h-8 sm:w-10 sm:h-10" />,
      titleMs: 'Lawati Gerai',
      titleEn: 'Visit Booths',
      descMs: 'Jelajahi semua gerai yang tersedia di acara ini. Setiap gerai mempunyai teknologi dan inovasi yang menarik!',
      descEn: 'Explore all available booths at this event. Each booth features exciting technology and innovation!',
      color: 'from-purple-500 to-purple-700',
      bgColor: 'bg-purple-50',
    },
    {
      number: 3,
      icon: <QrCode className="w-8 h-8 sm:w-10 sm:h-10" />,
      titleMs: 'Imbas Kod QR',
      titleEn: 'Scan QR Code',
      descMs: 'Klik "Imbas QR" di halaman utama, kemudian imbas kod QR di setiap gerai yang anda lawati.',
      descEn: 'Click "Scan QR" on the home page, then scan the QR code at each booth you visit.',
      color: 'from-green-500 to-green-700',
      bgColor: 'bg-green-50',
    },
    {
      number: 4,
      icon: <Star className="w-8 h-8 sm:w-10 sm:h-10" />,
      titleMs: 'Beri Penilaian',
      titleEn: 'Give Rating',
      descMs: 'Selepas mengimbas, berikan penilaian bintang dan komen untuk gerai tersebut (pilihan).',
      descEn: 'After scanning, give a star rating and comment for the booth (optional).',
      color: 'from-yellow-500 to-yellow-700',
      bgColor: 'bg-yellow-50',
    },
    {
      number: 5,
      icon: <Award className="w-8 h-8 sm:w-10 sm:h-10" />,
      titleMs: 'Dapatkan Sijil',
      titleEn: 'Earn Certificates',
      descMs: 'Lawat lebih banyak gerai untuk mendapat sijil pencapaian! 25% = Gangsa, 50% = Perak, 75% = Emas, 80% = Platinum.',
      descEn: 'Visit more booths to earn achievement certificates! 25% = Bronze, 50% = Silver, 75% = Gold, 80% = Platinum.',
      color: 'from-orange-500 to-orange-700',
      bgColor: 'bg-orange-50',
    },
  ]

  const tips = [
    {
      icon: <Smartphone className="w-6 h-6" />,
      titleMs: 'Pastikan Akses Kamera',
      titleEn: 'Ensure Camera Access',
      descMs: 'Benarkan akses kamera untuk mengimbas kod QR',
      descEn: 'Allow camera access to scan QR codes',
    },
    {
      icon: <Scan className="w-6 h-6" />,
      titleMs: 'Imbas dengan Jelas',
      titleEn: 'Scan Clearly',
      descMs: 'Pastikan kod QR dalam fokus dan pencahayaan mencukupi',
      descEn: 'Ensure QR code is in focus with good lighting',
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      titleMs: 'Kumpul Semua Sijil',
      titleEn: 'Collect All Certificates',
      descMs: 'Lawati semua gerai untuk dapatkan sijil Platinum!',
      descEn: 'Visit all booths to get Platinum certificate!',
    },
  ]

  const achievements = [
    { percentage: 25, name: 'Bronze Explorer', nameMs: 'Penjelajah Gangsa', color: 'from-amber-700 to-amber-900', emoji: '🥉' },
    { percentage: 50, name: 'Silver Pioneer', nameMs: 'Perintis Perak', color: 'from-gray-400 to-gray-600', emoji: '🥈' },
    { percentage: 75, name: 'Gold Champion', nameMs: 'Juara Emas', color: 'from-yellow-400 to-yellow-600', emoji: '🥇' },
    { percentage: 80, name: 'Platinum Master', nameMs: 'Sarjana Platinum', color: 'from-cyan-400 to-blue-600', emoji: '💎' },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-6 sm:py-12 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-4">
            <div className="relative w-20 h-14 sm:w-28 sm:h-20">
              <Image
                src="/images/logo/madani.png"
                alt="Madani Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
          
          <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 ${roboto.className}`}>
            Panduan Pelawat
          </h1>
          <p className={`text-xl sm:text-2xl text-blue-600 font-medium ${roboto.className}`}>
            Visitor Guide
          </p>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            {eventName}
          </p>
        </div>

        {/* Back to Home Button */}
        <div className="flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-md"
          >
            <Home className="w-5 h-5" />
            <span>Kembali / Back to Home</span>
          </Link>
        </div>

        {/* Introduction Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border-t-4 border-blue-500">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Cara Menggunakan Sistem / How to Use the System
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                Ikuti 5 langkah mudah di bawah untuk merekod lawatan anda dan mendapatkan sijil pencapaian!
              </p>
              <p className="text-sm sm:text-base text-gray-600">
                Follow these 5 easy steps below to log your visits and earn achievement certificates!
              </p>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900">
            Langkah-Langkah / Steps
          </h2>
          
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden sm:block absolute left-10 top-24 w-0.5 h-20 bg-gradient-to-b from-gray-300 to-gray-200 z-0"></div>
              )}
              
              {/* Step Card */}
              <div className="relative bg-white rounded-xl shadow-lg p-6 sm:p-8 hover:shadow-xl transition-shadow border-l-4 border-blue-500">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  {/* Step Number & Icon */}
                  <div className="flex-shrink-0">
                    <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center text-white shadow-lg`}>
                      {step.icon}
                    </div>
                    <div className="mt-2 text-center">
                      <span className={`inline-block px-3 py-1 bg-gradient-to-r ${step.color} text-white text-xs sm:text-sm font-bold rounded-full`}>
                        Langkah {step.number}
                      </span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                        {step.titleMs}
                      </h3>
                      <p className="text-base sm:text-lg font-semibold text-gray-700">
                        {step.titleEn}
                      </p>
                    </div>
                    
                    <div className={`p-4 ${step.bgColor} rounded-lg`}>
                      <p className="text-sm sm:text-base text-gray-800">
                        <span className="font-semibold">🇲🇾 </span>{step.descMs}
                      </p>
                      <p className="text-sm sm:text-base text-gray-700 mt-2">
                        <span className="font-semibold">🇬🇧 </span>{step.descEn}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Achievement Levels */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-6">
            Tahap Pencapaian / Achievement Levels
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br ${achievement.color} p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-4xl sm:text-5xl">{achievement.emoji}</span>
                  <div className="text-white">
                    <h3 className="text-xl sm:text-2xl font-bold">{achievement.percentage}%</h3>
                    <p className="text-sm sm:text-base font-semibold">{achievement.nameMs}</p>
                    <p className="text-xs sm:text-sm opacity-90">{achievement.name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
            <p className="text-sm sm:text-base text-center text-gray-800">
              💡 <span className="font-bold">Petua:</span> Lawati semua gerai untuk dapatkan sijil Platinum! Anda boleh muat turun sijil untuk kenangan.
            </p>
            <p className="text-xs sm:text-sm text-center text-gray-700 mt-1">
              💡 <span className="font-bold">Tip:</span> Visit all booths to get Platinum certificate! You can download the certificates as keepsakes.
            </p>
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 sm:p-8 text-white">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">
            Tips & Petua 💡
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tips.map((tip, index) => (
              <div key={index} className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 hover:bg-opacity-30 transition-all">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 bg-white bg-opacity-30 rounded-full flex items-center justify-center">
                    {tip.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-base sm:text-lg">{tip.titleMs}</h3>
                    <p className="text-sm opacity-90">{tip.titleEn}</p>
                  </div>
                  <p className="text-xs sm:text-sm">{tip.descMs}</p>
                  <p className="text-xs opacity-80">{tip.descEn}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-8 sm:p-12 text-center text-white">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Sudah Bersedia? / Ready?
          </h2>
          <p className="text-base sm:text-lg mb-6 opacity-90">
            Mulakan pengalaman anda sekarang! / Start your experience now!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              <Home className="w-6 h-6" />
              <span>Ke Halaman Utama / To Home Page</span>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs sm:text-sm text-gray-500 pb-4">
          <p>Powered by MOSTI</p>
        </div>
      </div>
    </main>
  )
}
