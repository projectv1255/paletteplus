'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { getFavoriteColors, removeFavoriteColor } from '@/lib/utils/favorites-utils'
import { toast } from '@/components/ui/use-toast'
import { Copy, Trash2 } from 'lucide-react'

interface FavoritesModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectColor: (color: string) => void
}

export function FavoritesModal({
  isOpen,
  onClose,
  onSelectColor
}: FavoritesModalProps) {
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    if (isOpen) {
      setFavorites(getFavoriteColors())
    }
  }, [isOpen])

  const handleCopyColor = (color: string) => {
    navigator.clipboard.writeText(color)
    toast({
      title: "Color copied",
      description: `${color} has been copied to your clipboard.`
    })
  }

  const handleRemoveColor = (color: string) => {
    removeFavoriteColor(color)
    setFavorites(getFavoriteColors())
    toast({
      title: "Color removed",
      description: `${color} has been removed from your favorites.`
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Favorite Colors</DialogTitle>
          <DialogDescription>View and manage your favorite colors.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          {favorites.map((color) => (
            <div
              key={color}
              className="group relative flex items-center gap-2 p-2 rounded-lg border hover:border-primary cursor-pointer"
              onClick={() => onSelectColor(color)}
            >
              <div
                className="w-8 h-8 rounded"
                style={{ backgroundColor: color }}
              />
              <span className="font-mono text-sm">{color}</span>
              <div className="absolute right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCopyColor(color)
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-500"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemoveColor(color)
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {favorites.length === 0 && (
            <div className="col-span-2 text-center py-8 text-muted-foreground">
              No favorite colors yet. Click the heart icon on any color to add it to your favorites.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

