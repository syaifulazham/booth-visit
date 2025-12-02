'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

interface DeleteBoothButtonProps {
  boothId: string
  boothName: string
}

export function DeleteBoothButton({ boothId, boothName }: DeleteBoothButtonProps) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${boothName}"? This action cannot be undone.`)) {
      return
    }

    setDeleting(true)
    try {
      const response = await fetch(`/api/admin/booths/${boothId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert('Failed to delete booth')
      }
    } catch (error) {
      alert('Error deleting booth')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDelete}
      disabled={deleting}
      className="text-red-600 hover:text-red-700"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  )
}
