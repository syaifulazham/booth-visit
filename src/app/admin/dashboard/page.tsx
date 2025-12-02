import { prisma } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Building2, ClipboardCheck } from 'lucide-react'
import { ExportButtons } from '@/components/admin/ExportButtons'

export const dynamic = 'force-dynamic'

async function getDashboardStats() {
  const [totalVisitors, totalBooths, totalVisits, recentVisits] = await Promise.all([
    prisma.visitor.count(),
    prisma.booth.count(),
    prisma.visit.count(),
    prisma.visit.findMany({
      take: 10,
      orderBy: { visitedAt: 'desc' },
      include: {
        visitor: true,
        booth: true,
      },
    }),
  ])

  return {
    totalVisitors,
    totalBooths,
    totalVisits,
    recentVisits,
  }
}

export default async function DashboardPage() {
  const stats = await getDashboardStats()

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600">Overview of booth visits and visitor statistics</p>
        </div>
        <ExportButtons />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVisitors}</div>
            <p className="text-xs text-muted-foreground">
              Registered visitors
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Booths</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBooths}</div>
            <p className="text-xs text-muted-foreground">
              Active booths
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVisits}</div>
            <p className="text-xs text-muted-foreground">
              Booth visits logged
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Visits */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Visits</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recentVisits.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No visits yet</p>
          ) : (
            <div className="space-y-4">
              {stats.recentVisits.map((visit) => (
                <div
                  key={visit.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0"
                >
                  <div>
                    <p className="font-medium">{visit.visitor.name}</p>
                    <p className="text-sm text-gray-500">
                      visited <span className="font-medium">{visit.booth.boothName}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {new Date(visit.visitedAt).toLocaleString('en-MY', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
