'use client'

import { useState } from 'react'
import { X, Link, Users, FileText, Image, FileCode, Command, Code, Square, Facebook, Twitter, FileJson } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { exportPalette } from '@/lib/utils/color-utils'
import { toast } from '@/components/ui/use-toast'

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
  colors: string[]
}

export function ExportModal({ isOpen, onClose, colors }: ExportModalProps) {
  const [loading, setLoading] = useState(false)

  const handleExport = async (format: string) => {
    setLoading(true)
    try {
      const exportedContent = await exportPalette(colors, format)
      await navigator.clipboard.writeText(exportedContent)
      toast({
        title: "Copied to clipboard",
        description: `Your palette has been copied in ${format.toUpperCase()} format.`
      })
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting your palette.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
      onClose()
    }
  }

  const handleShare = async (platform: string) => {
    const url = await exportPalette(colors, 'url')
    const text = `Check out this color palette I created!`
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`)
        break
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`)
        break
      // Add other platforms as needed
    }
    onClose()
  }

  const exportOptions = [
    { icon: Link, label: 'URL', onClick: () => handleExport('url') },
    { icon: FileText, label: 'Text', onClick: () => handleExport('text') },
    { icon: FileCode, label: 'CSS', onClick: () => handleExport('css') },
    { icon: Code, label: 'SVG', onClick: () => handleExport('svg') },
    { icon: FileJson, label: 'JSON', onClick: () => handleExport('json') },
  ]

  const socialOptions = [
    { icon: Code, label: 'Embed', onClick: () => handleExport('embed') },
    { icon: Facebook, label: 'Facebook', onClick: () => handleShare('facebook') },
    { icon: Twitter, label: 'Twitter', onClick: () => handleShare('twitter') },
    { icon: Image, label: 'Pinterest', onClick: () => handleShare('pinterest') },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Palette</DialogTitle>
          <DialogDescription>Choose a format to export your color palette.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-4 gap-4 py-4">
          {exportOptions.map((option) => (
            <button
              key={option.label}
              onClick={option.onClick}
              disabled={loading}
              className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-gray-100 disabled:opacity-50"
            >
              <option.icon className="h-6 w-6" />
              <span className="text-sm">{option.label}</span>
            </button>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-4 py-4 border-t">
          {socialOptions.map((option) => (
            <button
              key={option.label}
              onClick={option.onClick}
              disabled={loading}
              className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-gray-100 disabled:opacity-50"
            >
              <option.icon className="h-6 w-6" />
              <span className="text-sm">{option.label}</span>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

