'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { View, Share2, Settings, Palette, Grid3X3, Camera, ImageIcon, Settings2, PlayCircle, Check, SaveIcon, FolderOpen, ArrowLeft, ArrowRight, Heart } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent
} from '@/components/ui/dropdown-menu'
import { ExportModal } from './modals/export-modal'
import { ImageUploadModal } from './modals/image-upload-modal'
import { toast } from '@/components/ui/use-toast'
import { simulateColorBlindness } from '@/lib/utils/color-utils'
import { generateCollage, downloadBlob } from '@/lib/utils/collage-utils'
import { Input } from '@/components/ui/input'
import { CollectionsModal } from './modals/collections-modal'
import { SavePaletteModal } from './modals/save-palette-modal'
import { generateId } from '@/lib/utils/id-utils'
import { ProModal } from './modals/pro-modal'
import { FavoritesModal } from './modals/favorites-modal'

interface SiteHeaderProps {
  colors: string[]
  onColorsChange: (colors: string[]) => void
  onColorBlindnessChange: (type: string | null) => void
  colorBlindnessType: string | null
  canUndo: boolean
  canRedo: boolean
  handleUndo: () => void
  handleRedo: () => void
}

interface SavedPalette {
  id: string
  name: string
  colors: string[]
  saves: number
  createdAt: string
}

export function SiteHeader({ 
  colors, 
  onColorsChange, 
  onColorBlindnessChange, 
  colorBlindnessType, 
  canUndo, 
  canRedo,
  handleUndo,
  handleRedo
}: SiteHeaderProps) {
  const [showExport, setShowExport] = useState(false)
  const [showImageUpload, setShowImageUpload] = useState(false)
  const [showCollections, setShowCollections] = useState(false)
  const [savedPalettes, setSavedPalettes] = useState<SavedPalette[]>([])
  const [showSavePaletteModal, setShowSavePaletteModal] = useState(false)
  const [showProModal, setShowProModal] = useState(false)
  const [showFavorites, setShowFavorites] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('savedPalettes')
    if (saved) {
      setSavedPalettes(JSON.parse(saved))
    }
  }, [])

  const handleMakeCollage = async () => {
    try {
      const collage = await generateCollage(colors);
      downloadBlob(collage, 'palette-collage.png');
      toast({
        title: "Collage generated",
        description: "Your collage has been downloaded successfully."
      });
    } catch (error) {
      console.error("Error generating collage:", error);
      toast({
        title: "Error generating collage",
        description: "An error occurred while generating the collage. Please try again later.",
        variant: "destructive"
      });
    }
  }

  const handleWatchTutorial = () => {
    window.open('https://www.youtube.com/watch?v=tutorial-id', '_blank')
  }

  const deletePalette = (id: string) => {
    const newPalettes = savedPalettes.filter(p => p.id !== id)
    setSavedPalettes(newPalettes)
    localStorage.setItem('savedPalettes', JSON.stringify(newPalettes))
    toast({
      title: "Palette deleted",
      description: "The palette has been removed from your collections."
    })
  }

  const loadPalette = (palette: SavedPalette) => {
    onColorsChange(palette.colors)
  }

  const handleQuickSave = () => {
    const quickSaveName = `Quick Save ${new Date().toLocaleString()}`
    const newPalette: SavedPalette = {
      id: generateId(),
      name: quickSaveName,
      colors,
      saves: 0,
      createdAt: new Date().toISOString()
    }
    const newPalettes = [...savedPalettes, newPalette]
    setSavedPalettes(newPalettes)
    localStorage.setItem('savedPalettes', JSON.stringify(newPalettes))
    toast({
      title: "Palette saved",
      description: "Your palette has been quick saved to collections."
    })
  }

  return (
    <header className="border-b">
      <div className="flex items-center justify-between px-4 h-14 flex-wrap">
        <Link href="/" className="text-2xl font-bold text-blue-500 py-2">
          Palette+
        </Link>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="text-pink-500" onClick={() => setShowProModal(true)}>Go Pro</Button>
        </div>
      </div>
      <div className="flex items-center justify-between px-4 h-auto py-2 border-t flex-wrap gap-2">
        <p className="text-sm text-muted-foreground w-full text-center sm:text-left sm:w-auto">
          Press the spacebar to generate color palettes!
        </p>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Palette className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => setShowSavePaletteModal(true)}>
                <SaveIcon className="mr-2 h-4 w-4" />
                Save Palette
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setShowFavorites(true)}>
                <Heart className="mr-2 h-4 w-4" />
                Favorite Colors
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setShowCollections(true)}>
                <FolderOpen className="mr-2 h-4 w-4" />
                View Collections
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={handleQuickSave}>
                <Palette className="mr-2 h-4 w-4" />
                Quick Save
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" size="icon" onClick={() => setShowImageUpload(true)}>
            <Camera className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleUndo}
            disabled={!canUndo}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleRedo}
            disabled={!canRedo}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={handleMakeCollage}>
                <Grid3X3 className="mr-2 h-4 w-4" />
                Make a collage
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => {}}>
                <Settings2 className="mr-2 h-4 w-4" />
                Generate method
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => {}}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={handleWatchTutorial}>
                <PlayCircle className="mr-2 h-4 w-4" />
                Watch tutorial
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex items-center gap-2 ml-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative px-2 sm:px-4">
                  <View className="h-4 w-4 mr-2" />
                  View
                  {colorBlindnessType && (
                    <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      •
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuItem onSelect={() => onColorBlindnessChange(null)}>
                  Normal Vision
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {[
                  'Protanopia',
                  'Deuteranopia',
                  'Tritanopia',
                  'Achromatopsia',
                  'Protanomaly',
                  'Deuteranomaly',
                  'Tritanomaly',
                  'Achromatomaly'
                ].map((type) => (
                  <DropdownMenuItem
                    key={type}
                    onSelect={() => onColorBlindnessChange(type.toLowerCase())}
                    className="flex items-center"
                  >
                    <div
                      className="w-4 h-4 rounded-full mr-2"
                      style={{
                        background: `linear-gradient(to right, 
                          ${simulateColorBlindness('#ff0000', type.toLowerCase())},
                          ${simulateColorBlindness('#00ff00', type.toLowerCase())},
                          ${simulateColorBlindness('#0000ff', type.toLowerCase())}
                        )`
                      }}
                    />
                    {type}
                    {colorBlindnessType === type.toLowerCase() && (
                      <Check className="ml-auto h-4 w-4" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="sm" className="px-2 sm:px-4" onClick={() => setShowExport(true)}>
              <Share2 className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>
        </div>
      </div>

      <ExportModal
        isOpen={showExport}
        onClose={() => setShowExport(false)}
        colors={colors}
      />

      <ImageUploadModal
        isOpen={showImageUpload}
        onClose={() => setShowImageUpload(false)}
        onUpload={(newColors) => {
          onColorsChange(newColors)
          toast({
            title: "Palette updated",
            description: "Your palette has been updated based on the uploaded image.",
          })
        }}
      />

      <CollectionsModal
        isOpen={showCollections}
        onClose={() => setShowCollections(false)}
        savedPalettes={savedPalettes}
        onSelectPalette={onColorsChange}
        onDeletePalette={deletePalette}
      />

      <SavePaletteModal
        isOpen={showSavePaletteModal}
        onClose={() => setShowSavePaletteModal(false)}
        onSave={(name) => {
          const newPalette: SavedPalette = {
            id: generateId(),
            name,
            colors,
            saves: 0,
            createdAt: new Date().toISOString()
          }
          const newPalettes = [...savedPalettes, newPalette]
          setSavedPalettes(newPalettes)
          localStorage.setItem('savedPalettes', JSON.stringify(newPalettes))
          setShowSavePaletteModal(false)
          toast({
            title: "Palette saved",
            description: "Your palette has been saved to collections."
          })
        }}
        colors={colors}
      />
      <ProModal
        isOpen={showProModal}
        onClose={() => setShowProModal(false)}
      />
      <FavoritesModal
        isOpen={showFavorites}
        onClose={() => setShowFavorites(false)}
        onSelectColor={(color) => {
          const newColors = [...colors, color]
          onColorsChange(newColors)
          setShowFavorites(false)
          toast({
            title: "Color added",
            description: `${color} has been added to your palette.`
          })
        }}
      />
    </header>
  )
}

