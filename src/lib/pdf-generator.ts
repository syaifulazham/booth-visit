import jsPDF from 'jspdf'

interface BoothPDFData {
  boothName: string
  ministry: string
  agency: string
  abbreviationName: string
  picName?: string
  picPhone?: string
  picEmail?: string
  qrCodeDataURL: string
  visitUrl: string
}

export async function generateBoothPDF(data: BoothPDFData): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()

  // Header - MOSTI Logo area (you can add actual logo later)
  doc.setFillColor(59, 130, 246) // Blue
  doc.rect(0, 0, pageWidth, 40, 'F')
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.text('MOSTI STEM & AI', pageWidth / 2, 20, { align: 'center' })
  
  doc.setFontSize(14)
  doc.text('Booth Visit QR Code', pageWidth / 2, 32, { align: 'center' })

  // Booth Name (Large, centered)
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(20)
  doc.text(data.boothName, pageWidth / 2, 60, { align: 'center' })

  // Abbreviation
  doc.setFontSize(14)
  doc.setTextColor(100, 100, 100)
  doc.text(data.abbreviationName, pageWidth / 2, 70, { align: 'center' })

  // QR Code (centered, large)
  const qrSize = 80
  const qrX = (pageWidth - qrSize) / 2
  const qrY = 80
  doc.addImage(data.qrCodeDataURL, 'PNG', qrX, qrY, qrSize, qrSize)

  // Instructions
  doc.setFontSize(12)
  doc.setTextColor(0, 0, 0)
  doc.text('Scan QR Code to Log Your Visit', pageWidth / 2, qrY + qrSize + 10, {
    align: 'center',
  })
  doc.text('Imbas Kod QR untuk Merekod Lawatan Anda', pageWidth / 2, qrY + qrSize + 17, {
    align: 'center',
  })

  // Booth Details Box
  const detailsY = qrY + qrSize + 30
  doc.setFillColor(245, 245, 245)
  doc.rect(20, detailsY, pageWidth - 40, 50, 'F')
  doc.setDrawColor(200, 200, 200)
  doc.rect(20, detailsY, pageWidth - 40, 50, 'S')

  let currentY = detailsY + 10

  doc.setFontSize(10)
  doc.setTextColor(0, 0, 0)
  
  doc.text('Ministry / Kementerian: ' + data.ministry, 25, currentY)
  currentY += 7

  doc.text('Agency / Agensi: ' + data.agency, 25, currentY)
  currentY += 7

  if (data.picName) {
    doc.text('Person In Charge: ' + data.picName, 25, currentY)
    currentY += 7
  }

  if (data.picPhone) {
    doc.text('Phone: ' + data.picPhone, 25, currentY)
    currentY += 7
  }

  // URL at bottom
  doc.setFontSize(8)
  doc.setTextColor(100, 100, 100)
  doc.text(data.visitUrl, pageWidth / 2, pageHeight - 20, { align: 'center' })

  // Footer
  doc.setFontSize(9)
  doc.text('Powered by MOSTI', pageWidth / 2, pageHeight - 10, { align: 'center' })

  // Save the PDF
  doc.save(`${data.abbreviationName}_QR_Code.pdf`)
}
