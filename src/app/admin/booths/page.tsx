import { prisma } from '@/lib/db'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Edit, Trash2, QrCode, Building2 } from 'lucide-react'
import { DeleteBoothButton } from '@/components/admin/DeleteBoothButton'

export const dynamic = 'force-dynamic'

async function getBooths() {
  return await prisma.booth.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { visits: true },
      },
    },
  })
}

export default async function BoothsPage() {
  const booths = await getBooths()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Booth Management</h2>
          <p className="text-gray-600">Manage exhibition booths and QR codes</p>
        </div>
        <Link href="/admin/booths/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Booth
          </Button>
        </Link>
      </div>

      {booths.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No booths yet</p>
            <Link href="/admin/booths/new">
              <Button>Create Your First Booth</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booth Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booth Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ministry
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Agency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Visits
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {booths.map((booth) => (
                <tr key={booth.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {booth.boothNumber || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {booth.boothName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {booth.abbreviationName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {booth.ministry}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {booth.agency}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {booth._count.visits}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Link href={`/admin/booths/${booth.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/admin/booths/${booth.id}/qr`}>
                      <Button variant="outline" size="sm">
                        <QrCode className="h-4 w-4" />
                      </Button>
                    </Link>
                    <DeleteBoothButton boothId={booth.id} boothName={booth.boothName} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
