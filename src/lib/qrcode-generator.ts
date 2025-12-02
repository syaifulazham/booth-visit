import QRCode from 'qrcode'

export async function generateQRCode(url: string): Promise<string> {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(url, {
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    })
    return qrCodeDataURL
  } catch (error) {
    console.error('QR Code generation error:', error)
    throw new Error('Failed to generate QR code')
  }
}

export async function generateQRCodeBuffer(url: string): Promise<Buffer> {
  try {
    const buffer = await QRCode.toBuffer(url, {
      width: 400,
      margin: 2,
    })
    return buffer
  } catch (error) {
    console.error('QR Code buffer generation error:', error)
    throw new Error('Failed to generate QR code buffer')
  }
}
