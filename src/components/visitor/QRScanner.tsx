'use client'

import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { X, Camera } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface QRScannerProps {
  onClose: () => void
}

export function QRScanner({ onClose }: QRScannerProps) {
  const [error, setError] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const router = useRouter()

  useEffect(() => {
    const scanner = new Html5Qrcode('qr-reader')
    scannerRef.current = scanner

    const startScanner = async () => {
      try {
        setIsScanning(true)
        await scanner.start(
          { facingMode: 'environment' }, // Use back camera
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            handleScan(decodedText)
          },
          () => {
            // Error callback for failed scans (ignore)
          }
        )
      } catch (err: any) {
        setError('Tidak dapat mengakses kamera / Cannot access camera')
        setIsScanning(false)
      }
    }

    startScanner()

    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(console.error)
      }
    }
  }, [])

  const handleScan = async (scannedText: string) => {
    try {
      // Extract booth hashcode from URL
      const urlMatch = scannedText.match(/\/visit\/booth\/([a-z0-9]+)/)
      
      if (!urlMatch) {
        setError('QR kod tidak sah / Invalid QR code. This is not an event booth QR code.')
        return
      }

      const hashcode = urlMatch[1]

      // Verify booth exists
      const response = await fetch(`/api/booths/verify/${hashcode}`)
      
      if (!response.ok) {
        setError('Gerai tidak dijumpai / Booth not found. This QR code is not associated with this event.')
        return
      }

      // Stop scanner and redirect
      if (scannerRef.current?.isScanning) {
        await scannerRef.current.stop()
      }

      router.push(`/visit/booth/${hashcode}`)
    } catch (err) {
      setError('Ralat mengimbas / Scan error. Please try again.')
    }
  }

  const handleClose = async () => {
    if (scannerRef.current?.isScanning) {
      await scannerRef.current.stop()
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Imbas QR Kod / Scan QR Code</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-blue-700 rounded transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scanner Area */}
        <div className="relative bg-gray-900">
          <div id="qr-reader" className="w-full"></div>
          
          {/* Instructions Overlay */}
          {isScanning && !error && (
            <div className="absolute bottom-4 left-0 right-0 text-center">
              <p className="text-white text-sm bg-black bg-opacity-70 px-4 py-2 rounded-full inline-block">
                Arahkan kamera ke QR kod gerai
                <br />
                Point camera at booth QR code
              </p>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border-t border-red-200">
            <div className="flex items-start gap-2">
              <span className="text-2xl">⚠️</span>
              <div className="flex-1">
                <p className="text-sm text-red-800 font-medium">
                  {error}
                </p>
                <button
                  onClick={() => setError(null)}
                  className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
                >
                  Cuba lagi / Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer Instructions */}
        <div className="p-4 bg-gray-50 text-center">
          <p className="text-xs text-gray-600">
            Pastikan QR kod jelas dan dalam fokus
            <br />
            Make sure QR code is clear and in focus
          </p>
        </div>
      </div>
    </div>
  )
}
