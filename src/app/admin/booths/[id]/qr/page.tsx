import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { QRCodeDisplay } from '@/components/admin/QRCodeDisplay'
import { CopyUrlButton } from '@/components/admin/CopyUrlButton'

export const dynamic = 'force-dynamic'

async function getBooth(id: string) {
  const booth = await prisma.booth.findUnique({
    where: { id },
  })
  return booth
}

export default async function BoothQRPage({ params }: { params: { id: string } }) {
  const booth = await getBooth(params.id)

  if (!booth) {
    notFound()
  }

  const visitUrl = `${process.env.NEXT_PUBLIC_APP_URL}/visit/booth/${booth.hashcode}`

  return (
    <div className="max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>QR Code - {booth.boothName}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Booth Details */}
            <div className="space-y-4">
              {booth.boothNumber && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Booth Number</h3>
                  <p className="text-lg font-semibold">{booth.boothNumber}</p>
                </div>
              )}
              <div>
                <h3 className="text-sm font-medium text-gray-500">Booth Name</h3>
                <p className="text-lg font-semibold">{booth.boothName}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Ministry</h3>
                <p className="text-lg">{booth.ministry}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Agency</h3>
                <p className="text-lg">{booth.agency}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Abbreviation</h3>
                <p className="text-lg">{booth.abbreviationName}</p>
              </div>
              {booth.picName && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Person In Charge</h3>
                  <p className="text-lg">{booth.picName}</p>
                  {booth.picPhone && <p className="text-sm text-gray-600">{booth.picPhone}</p>}
                  {booth.picEmail && <p className="text-sm text-gray-600">{booth.picEmail}</p>}
                </div>
              )}
              <CopyUrlButton url={visitUrl} />
            </div>

            {/* QR Code */}
            <QRCodeDisplay 
              url={visitUrl} 
              boothName={booth.boothName}
              booth={{
                ministry: booth.ministry,
                agency: booth.agency,
                abbreviationName: booth.abbreviationName,
                picName: booth.picName || undefined,
                picPhone: booth.picPhone || undefined,
                picEmail: booth.picEmail || undefined,
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
