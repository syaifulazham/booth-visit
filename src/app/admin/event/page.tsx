'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Calendar, MapPin, Clock, FileText, AlertTriangle, Trash2, Download, RotateCcw } from 'lucide-react'

type Event = {
  id: string
  name: string
  slogan: string | null
  venue: string
  dateStart: string
  dateEnd: string
  description: string | null
}

type Backup = {
  filename: string
  size: number
  created: string
  modified: string
}

export default function EventSettingsPage() {
  const router = useRouter()
  const [event, setEvent] = useState<Event | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    slogan: '',
    venue: '',
    dateStart: '',
    dateEnd: '',
    description: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [successMessage, setSuccessMessage] = useState('')
  
  // Reset Event states
  const [showResetModal, setShowResetModal] = useState(false)
  const [confirmationCode, setConfirmationCode] = useState('')
  const [userConfirmationInput, setUserConfirmationInput] = useState('')
  const [resetting, setResetting] = useState(false)
  const [resetError, setResetError] = useState('')
  
  // Restore Event states
  const [backups, setBackups] = useState<Backup[]>([])
  const [loadingBackups, setLoadingBackups] = useState(false)
  const [showRestoreModal, setShowRestoreModal] = useState(false)
  const [selectedBackup, setSelectedBackup] = useState<Backup | null>(null)
  const [restoreConfirmationCode, setRestoreConfirmationCode] = useState('')
  const [restoreUserInput, setRestoreUserInput] = useState('')
  const [restoring, setRestoring] = useState(false)
  const [restoreError, setRestoreError] = useState('')

  useEffect(() => {
    fetchEvent()
    fetchBackups()
  }, [])

  const fetchEvent = async () => {
    try {
      const response = await fetch('/api/admin/event')
      if (response.ok) {
        const data = await response.json()
        if (data.event) {
          setEvent(data.event)
          setFormData({
            name: data.event.name,
            slogan: data.event.slogan || '',
            venue: data.event.venue,
            dateStart: formatDateForInput(data.event.dateStart),
            dateEnd: formatDateForInput(data.event.dateEnd),
            description: data.event.description || '',
          })
        }
      }
    } catch (error) {
      console.error('Error fetching event:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchBackups = async () => {
    setLoadingBackups(true)
    try {
      const response = await fetch('/api/admin/event/backups')
      if (response.ok) {
        const data = await response.json()
        setBackups(data.backups || [])
      }
    } catch (error) {
      console.error('Error fetching backups:', error)
    } finally {
      setLoadingBackups(false)
    }
  }

  const formatDateForInput = (dateString: string) => {
    const date = new Date(dateString)
    return date.toISOString().slice(0, 16) // Format: YYYY-MM-DDTHH:MM
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: '',
      })
    }
    setSuccessMessage('')
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Event name is required'
    }
    if (!formData.venue.trim()) {
      newErrors.venue = 'Venue is required'
    }
    if (!formData.dateStart) {
      newErrors.dateStart = 'Start date/time is required'
    }
    if (!formData.dateEnd) {
      newErrors.dateEnd = 'End date/time is required'
    }
    if (formData.dateStart && formData.dateEnd) {
      const start = new Date(formData.dateStart)
      const end = new Date(formData.dateEnd)
      if (end <= start) {
        newErrors.dateEnd = 'End date/time must be after start date/time'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setSaving(true)
    setErrors({})
    setSuccessMessage('')

    try {
      const response = await fetch('/api/admin/event', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrors({ form: data.error || 'Failed to save event' })
        return
      }

      setEvent(data.event)
      setSuccessMessage('Event settings saved successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      setErrors({ form: 'Network error. Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  const generateConfirmationCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // Exclude similar-looking characters
    let code = ''
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
  }

  const handleOpenResetModal = () => {
    const code = generateConfirmationCode()
    setConfirmationCode(code)
    setUserConfirmationInput('')
    setResetError('')
    setShowResetModal(true)
  }

  const handleCloseResetModal = () => {
    setShowResetModal(false)
    setConfirmationCode('')
    setUserConfirmationInput('')
    setResetError('')
  }

  const handleResetEvent = async () => {
    if (userConfirmationInput !== confirmationCode) {
      setResetError('Confirmation code does not match!')
      return
    }

    setResetting(true)
    setResetError('')

    try {
      const response = await fetch('/api/admin/event/reset', {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        setResetError(data.error || 'Failed to reset event')
        return
      }

      // Show success and close modal
      alert(`Event reset successful!\n\nBackup created: ${data.backup.filename}\n\nDeleted:\n- Booths: ${data.backup.stats.booths}\n- Visitors: ${data.backup.stats.visitors}\n- Visits: ${data.backup.stats.visits}`)
      handleCloseResetModal()
      
      // Reload the page to reflect changes
      window.location.reload()
    } catch (error) {
      setResetError('Network error. Please try again.')
    } finally {
      setResetting(false)
    }
  }

  const handleOpenRestoreModal = (backup: Backup) => {
    const code = generateConfirmationCode()
    setSelectedBackup(backup)
    setRestoreConfirmationCode(code)
    setRestoreUserInput('')
    setRestoreError('')
    setShowRestoreModal(true)
  }

  const handleCloseRestoreModal = () => {
    setShowRestoreModal(false)
    setSelectedBackup(null)
    setRestoreConfirmationCode('')
    setRestoreUserInput('')
    setRestoreError('')
  }

  const handleRestoreBackup = async () => {
    if (restoreUserInput !== restoreConfirmationCode) {
      setRestoreError('Confirmation code does not match!')
      return
    }

    if (!selectedBackup) {
      setRestoreError('No backup selected')
      return
    }

    setRestoring(true)
    setRestoreError('')

    try {
      const response = await fetch('/api/admin/event/restore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: selectedBackup.filename,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setRestoreError(data.error || 'Failed to restore backup')
        return
      }

      // Show success and close modal
      alert(`Backup restored successfully!\n\nRestored:\n- Booths: ${data.restored.booths}\n- Visitors: ${data.restored.visitors}\n- Visits: ${data.restored.visits}\n\nFrom backup: ${data.restored.timestamp}`)
      handleCloseRestoreModal()
      
      // Reload the page to reflect changes
      window.location.reload()
    } catch (error) {
      setRestoreError('Network error. Please try again.')
    } finally {
      setRestoring(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-MY', {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Event Settings</h1>
        <p className="text-gray-600 mt-2">
          {event ? 'Update' : 'Configure'} the details for your event
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Event Information</CardTitle>
          <CardDescription>
            This application manages a single event at a time. Update the details below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Success Message */}
            {successMessage && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-sm font-medium">✓ {successMessage}</p>
              </div>
            )}

            {/* Form Error */}
            {errors.form && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{errors.form}</p>
              </div>
            )}

            {/* Event Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Event Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                disabled={saving}
                className={errors.name ? 'border-red-500' : ''}
                placeholder="e.g. MOSTI STEM & AI Showcase 2025"
              />
              {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* Slogan */}
            <div className="space-y-2">
              <Label htmlFor="slogan" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Slogan
              </Label>
              <Input
                id="slogan"
                name="slogan"
                type="text"
                value={formData.slogan}
                onChange={handleChange}
                disabled={saving}
                placeholder="e.g. Empowering Innovation Through Science"
              />
            </div>

            {/* Venue */}
            <div className="space-y-2">
              <Label htmlFor="venue" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Venue <span className="text-red-500">*</span>
              </Label>
              <Input
                id="venue"
                name="venue"
                type="text"
                value={formData.venue}
                onChange={handleChange}
                disabled={saving}
                className={errors.venue ? 'border-red-500' : ''}
                placeholder="e.g. Putrajaya International Convention Centre (PICC)"
              />
              {errors.venue && <p className="text-sm text-red-600">{errors.venue}</p>}
            </div>

            {/* Date/Time Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Start Date/Time */}
              <div className="space-y-2">
                <Label htmlFor="dateStart" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Start Date & Time <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="dateStart"
                  name="dateStart"
                  type="datetime-local"
                  value={formData.dateStart}
                  onChange={handleChange}
                  disabled={saving}
                  className={errors.dateStart ? 'border-red-500' : ''}
                />
                {errors.dateStart && <p className="text-sm text-red-600">{errors.dateStart}</p>}
              </div>

              {/* End Date/Time */}
              <div className="space-y-2">
                <Label htmlFor="dateEnd" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  End Date & Time <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="dateEnd"
                  name="dateEnd"
                  type="datetime-local"
                  value={formData.dateEnd}
                  onChange={handleChange}
                  disabled={saving}
                  className={errors.dateEnd ? 'border-red-500' : ''}
                />
                {errors.dateEnd && <p className="text-sm text-red-600">{errors.dateEnd}</p>}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Description (Optional)
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                disabled={saving}
                rows={5}
                placeholder="Enter event description, objectives, or additional information..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : event ? 'Update Event' : 'Create Event'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/dashboard')}
                disabled={saving}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Restore from Backup Section */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-900 flex items-center gap-2">
            <Download className="h-5 w-5" />
            Restore from Backup
          </CardTitle>
          <CardDescription className="text-blue-700">
            Restore event data from a previous backup file. This will replace all current data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingBackups ? (
            <p className="text-sm text-gray-500">Loading backups...</p>
          ) : backups.length === 0 ? (
            <p className="text-sm text-gray-500">No backup files available.</p>
          ) : (
            <div className="space-y-3">
              {backups.map((backup) => (
                <div
                  key={backup.filename}
                  className="flex items-center justify-between p-3 bg-white border border-blue-200 rounded-lg hover:border-blue-300 transition-colors"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {backup.filename}
                    </p>
                    <p className="text-xs text-gray-500">
                      Created: {formatDate(backup.created)} • Size: {formatFileSize(backup.size)}
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenRestoreModal(backup)}
                    className="flex items-center gap-2 ml-4"
                    disabled={restoring}
                  >
                    <RotateCcw className="h-4 w-4" />
                    Restore
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reset Event Section */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-900 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription className="text-red-700">
            Reset all event data. This action will create a backup before deleting all booths, visitors, and visits.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            type="button"
            variant="destructive"
            onClick={handleOpenResetModal}
            className="flex items-center gap-2"
            disabled={resetting}
          >
            <Trash2 className="h-4 w-4" />
            Reset Event
          </Button>
        </CardContent>
      </Card>

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle className="text-red-900 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Confirm Reset Event
              </CardTitle>
              <CardDescription>
                This will permanently delete all data and create a backup.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Warning Message */}
              <div className="p-4 bg-red-100 border border-red-300 rounded-lg">
                <p className="text-sm text-red-900 font-medium mb-2">
                  ⚠️ Warning: This action cannot be undone!
                </p>
                <p className="text-xs text-red-800">
                  The following data will be deleted:
                </p>
                <ul className="text-xs text-red-800 list-disc list-inside mt-1">
                  <li>All Booths</li>
                  <li>All Visitors</li>
                  <li>All Visits</li>
                </ul>
                <p className="text-xs text-red-800 mt-2">
                  A compressed backup will be created before deletion.
                </p>
              </div>

              {/* Confirmation Code */}
              <div className="space-y-2">
                <Label htmlFor="confirmCode">
                  Enter this code to confirm: <span className="font-mono font-bold text-lg text-red-600">{confirmationCode}</span>
                </Label>
                <Input
                  id="confirmCode"
                  type="text"
                  value={userConfirmationInput}
                  onChange={(e) => setUserConfirmationInput(e.target.value.toUpperCase())}
                  placeholder="Enter confirmation code"
                  className={resetError ? 'border-red-500' : ''}
                  disabled={resetting}
                  autoFocus
                />
                {resetError && <p className="text-sm text-red-600">{resetError}</p>}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseResetModal}
                  disabled={resetting}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleResetEvent}
                  disabled={resetting || userConfirmationInput !== confirmationCode}
                >
                  {resetting ? 'Resetting...' : 'Confirm Reset'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Restore Confirmation Modal */}
      {showRestoreModal && selectedBackup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle className="text-blue-900 flex items-center gap-2">
                <RotateCcw className="h-5 w-5" />
                Confirm Restore Backup
              </CardTitle>
              <CardDescription>
                This will replace all current data with backup data.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Warning Message */}
              <div className="p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
                <p className="text-sm text-yellow-900 font-medium mb-2">
                  ⚠️ Warning: Current data will be replaced!
                </p>
                <p className="text-xs text-yellow-800">
                  You are about to restore from:
                </p>
                <p className="text-xs text-yellow-800 font-mono mt-1 break-all">
                  {selectedBackup.filename}
                </p>
                <p className="text-xs text-yellow-800 mt-2">
                  Created: {formatDate(selectedBackup.created)}
                </p>
                <p className="text-xs text-yellow-800 mt-2">
                  All current booths, visitors, and visits will be deleted and replaced with the backup data.
                </p>
              </div>

              {/* Confirmation Code */}
              <div className="space-y-2">
                <Label htmlFor="restoreConfirmCode">
                  Enter this code to confirm: <span className="font-mono font-bold text-lg text-blue-600">{restoreConfirmationCode}</span>
                </Label>
                <Input
                  id="restoreConfirmCode"
                  type="text"
                  value={restoreUserInput}
                  onChange={(e) => setRestoreUserInput(e.target.value.toUpperCase())}
                  placeholder="Enter confirmation code"
                  className={restoreError ? 'border-red-500' : ''}
                  disabled={restoring}
                  autoFocus
                />
                {restoreError && <p className="text-sm text-red-600">{restoreError}</p>}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseRestoreModal}
                  disabled={restoring}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleRestoreBackup}
                  disabled={restoring || restoreUserInput !== restoreConfirmationCode}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {restoring ? 'Restoring...' : 'Confirm Restore'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
