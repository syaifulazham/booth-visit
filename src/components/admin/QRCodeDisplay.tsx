'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download, Printer, FileText } from 'lucide-react'

interface QRCodeDisplayProps {
  url: string
  boothName: string
  booth?: {
    ministry: string
    agency: string
    abbreviationName: string
    picName?: string
    picPhone?: string
    picEmail?: string
  }
}

export function QRCodeDisplay({ url, boothName, booth }: QRCodeDisplayProps) {
  const [qrCode, setQrCode] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const generateQR = async () => {
      try {
        const QRCode = (await import('qrcode')).default
        const dataUrl = await QRCode.toDataURL(url, {
          width: 400,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF',
          },
        })
        setQrCode(dataUrl)
      } catch (error) {
        console.error('QR generation error:', error)
      } finally {
        setLoading(false)
      }
    }

    generateQR()
  }, [url])

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = qrCode
    link.download = `${boothName.replace(/\s+/g, '_')}_QR.png`
    link.click()
  }

  const handlePrint = () => {
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>QR Code - ${boothName}</title>
            <style>
              body {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                margin: 0;
                font-family: Arial, sans-serif;
              }
              h1 {
                margin-bottom: 20px;
              }
              img {
                max-width: 400px;
              }
              .url {
                margin-top: 20px;
                font-size: 14px;
                color: #666;
              }
            </style>
          </head>
          <body>
            <h1>${boothName}</h1>
            <img src="${qrCode}" alt="QR Code" />
            <p class="url">${url}</p>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const handleDownloadPDF = async () => {
    if (!booth) {
      alert('Booth data not available')
      return
    }

    try {
      const { generateBoothPDF } = await import('@/lib/pdf-generator')
      
      const boothData = {
        boothName,
        ministry: booth.ministry,
        agency: booth.agency,
        abbreviationName: booth.abbreviationName,
        picName: booth.picName,
        picPhone: booth.picPhone,
        picEmail: booth.picEmail,
        qrCodeDataURL: qrCode,
        visitUrl: url,
      }
      
      await generateBoothPDF(boothData)
    } catch (error) {
      console.error('PDF generation error:', error)
      alert('Failed to generate PDF')
    }
  }

  if (loading) {
    return <div className="text-center py-8">Generating QR Code...</div>
  }

  return (
    <div className="space-y-4">
      <div className="border-2 border-gray-200 rounded-lg p-4 bg-white">
        {qrCode && (
          <img
            src={qrCode}
            alt="QR Code"
            className="w-full max-w-sm mx-auto"
          />
        )}
      </div>
      <div className="flex gap-2">
        <Button onClick={handleDownload} className="flex-1">
          <Download className="h-4 w-4 mr-2" />
          PNG
        </Button>
        {booth && (
          <Button onClick={handleDownloadPDF} variant="secondary" className="flex-1">
            <FileText className="h-4 w-4 mr-2" />
            PDF
          </Button>
        )}
        <Button onClick={handlePrint} variant="outline" className="flex-1">
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>
      </div>
    </div>
  )
}
