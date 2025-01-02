'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Heart, Trash2, Search, SortAsc, SortDesc } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

interface SavedPalette {
  id: string
  name: string
  colors: string[]
  saves: number
  createdAt: string
}

interface CollectionsModalProps {
  isOpen: boolean
  onClose: () => void
  savedPalettes: SavedPalette[]
  onSelectPalette: (colors: string[]) => void
  onDeletePalette: (id: string) => void
}

export function CollectionsModal({
  isOpen,
  onClose,
  savedPalettes,
  onSelectPalette,
  onDeletePalette
}: CollectionsModalProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  
  const filteredAndSortedPalettes = savedPalettes
    .filter(palette => 
      palette.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA
    })

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Your Collections</DialogTitle>
          <DialogDescription>View and manage your saved color palettes.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Your Collections</h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search palettes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-[200px]"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? (
                  <SortAsc className="h-4 w-4" />
                ) : (
                  <SortDesc className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="overflow-y-auto pr-2 -mr-2">
            <div className="grid grid-cols-1 gap-4">
              {filteredAndSortedPalettes.map((palette) => (
                <div
                  key={palette.id}
                  className="group relative border rounded-lg overflow-hidden hover:shadow-md transition-all"
                >
                  <button
                    onClick={() => onSelectPalette(palette.colors)}
                    className="w-full text-left"
                  >
                    <div className="flex h-20 w-full">
                      {palette.colors.map((color, index) => (
                        <div
                          key={index}
                          className="flex-1 h-full relative group/color"
                        >
                          <div 
                            className="absolute inset-0"
                            style={{ backgroundColor: color }}
                          />
                          <div className="opacity-0 group-hover/color:opacity-100 absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity">
                            <span className="text-white font-mono text-sm">
                              {color.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 flex items-center justify-between bg-white dark:bg-gray-950">
                      <div className="flex items-center gap-4">
                        <span className="font-medium">{palette.name}</span>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Heart className="h-3 w-3" />
                          <span>{palette.saves.toLocaleString()}</span>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(palette.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </button>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-8 w-8 bg-white/90 backdrop-blur-sm dark:bg-gray-950/90"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem
                          onClick={() => onDeletePalette(palette.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>

            {filteredAndSortedPalettes.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {searchTerm ? 'No palettes match your search' : 'No saved palettes yet'}
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

