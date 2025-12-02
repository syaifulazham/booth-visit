'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download, FileText, FileSpreadsheet } from 'lucide-react'
import { convertToCSV, downloadCSV, formatDateForCSV } from '@/lib/csv-export'

export function ExportButtons() {
  const [exporting, setExporting] = useState<string | null>(null)

  const exportVisitors = async () => {
    setExporting('visitors')
    try {
      const response = await fetch('/api/admin/reports/visitors')
      const data = await response.json()

      if (response.ok) {
        const headers = [
          'id',
          'name',
          'gender',
          'age',
          'visitorType',
          'sektor',
          'totalVisits',
          'registeredAt',
        ]
        
        const formattedData = data.visitors.map((v: any) => ({
          ...v,
          registeredAt: formatDateForCSV(v.registeredAt),
        }))
        
        const csv = convertToCSV(formattedData, headers)
        const timestamp = new Date().toISOString().split('T')[0]
        downloadCSV(csv, `visitors_report_${timestamp}.csv`)
      } else {
        alert('Failed to export visitors')
      }
    } catch (error) {
      alert('Error exporting visitors')
    } finally {
      setExporting(null)
    }
  }

  const exportVisits = async () => {
    setExporting('visits')
    try {
      const response = await fetch('/api/admin/reports/visits')
      const data = await response.json()

      if (response.ok) {
        const headers = [
          'visitId',
          'visitorName',
          'visitorGender',
          'visitorAge',
          'visitorType',
          'visitorSektor',
          'boothName',
          'boothMinistry',
          'boothAgency',
          'visitedAt',
          'ipAddress',
        ]
        
        const formattedData = data.visits.map((v: any) => ({
          ...v,
          visitedAt: formatDateForCSV(v.visitedAt),
        }))
        
        const csv = convertToCSV(formattedData, headers)
        const timestamp = new Date().toISOString().split('T')[0]
        downloadCSV(csv, `visits_report_${timestamp}.csv`)
      } else {
        alert('Failed to export visits')
      }
    } catch (error) {
      alert('Error exporting visits')
    } finally {
      setExporting(null)
    }
  }

  const exportBooths = async () => {
    setExporting('booths')
    try {
      const response = await fetch('/api/admin/reports/booths')
      const data = await response.json()

      if (response.ok) {
        const headers = [
          'id',
          'boothName',
          'ministry',
          'agency',
          'abbreviationName',
          'picName',
          'picPhone',
          'picEmail',
          'totalVisits',
          'hashcode',
          'createdAt',
        ]
        
        const formattedData = data.booths.map((b: any) => ({
          ...b,
          createdAt: formatDateForCSV(b.createdAt),
        }))
        
        const csv = convertToCSV(formattedData, headers)
        const timestamp = new Date().toISOString().split('T')[0]
        downloadCSV(csv, `booths_report_${timestamp}.csv`)
      } else {
        alert('Failed to export booths')
      }
    } catch (error) {
      alert('Error exporting booths')
    } finally {
      setExporting(null)
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={exportVisitors}
        disabled={exporting !== null}
      >
        <FileSpreadsheet className="h-4 w-4 mr-2" />
        {exporting === 'visitors' ? 'Exporting...' : 'Export Visitors'}
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={exportVisits}
        disabled={exporting !== null}
      >
        <FileSpreadsheet className="h-4 w-4 mr-2" />
        {exporting === 'visits' ? 'Exporting...' : 'Export Visits'}
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={exportBooths}
        disabled={exporting !== null}
      >
        <FileSpreadsheet className="h-4 w-4 mr-2" />
        {exporting === 'booths' ? 'Exporting...' : 'Export Booths'}
      </Button>
    </div>
  )
}
