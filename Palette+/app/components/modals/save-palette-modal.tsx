'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface SavePaletteModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (name: string) => void
  colors: string[]
}

export function SavePaletteModal({
  isOpen,
  onClose,
  onSave,
  colors
}: SavePaletteModalProps) {
  const [name, setName] = useState('')

  const handleSave = () => {
    if (name.trim()) {
      onSave(name)
      setName('')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Palette</DialogTitle>
          <DialogDescription>Enter a name for your new color palette.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex h-12 w-full rounded-md overflow-hidden">
            {colors.map((color, index) => (
              <div
                key={index}
                className="flex-1 h-full"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <div className="space-y-2">
            <Label htmlFor="palette-name">Palette Name</Label>
            <Input
              id="palette-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter a name for your palette"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSave()
                }
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={!name.trim()}>Save Palette</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

