'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

interface CopyUrlButtonProps {
  url: string
}

export function CopyUrlButton({ url }: CopyUrlButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="flex items-start gap-2">
      <div className="flex-1">
        <h3 className="text-sm font-medium text-gray-500 mb-1">Visit URL</h3>
        <p className="text-sm text-blue-600 break-all">{url}</p>
      </div>
      <button
        onClick={handleCopy}
        className="mt-6 p-2 hover:bg-gray-100 rounded-md transition-colors"
        title="Copy URL"
      >
        {copied ? (
          <Check className="h-5 w-5 text-green-600" />
        ) : (
          <Copy className="h-5 w-5 text-gray-600" />
        )}
      </button>
    </div>
  )
}
