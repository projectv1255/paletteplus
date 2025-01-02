'use client'

import { useState, useCallback } from 'react'
import { SiteHeader } from './components/site-header'
import ColorPaletteGenerator from './components/palette/color-palette-generator'
import { Toaster } from '@/components/ui/toaster'

const initialColors = [
  '#274060',
  '#335C81',
  '#65AFFF',
  '#1B2845',
  '#5899E2'
]

export default function Home() {
  const [colors, setColors] = useState(initialColors)
  const [colorBlindnessType, setColorBlindnessType] = useState<string | null>(null)
  const [history, setHistory] = useState<string[][]>([initialColors])
  const [currentIndex, setCurrentIndex] = useState(0)

  const updateColors = useCallback((newColors: string[]) => {
    setColors(newColors)
    // Add new colors to history after current index
    setHistory(prev => {
      const newHistory = prev.slice(0, currentIndex + 1)
      newHistory.push(newColors)
      return newHistory
    })
    setCurrentIndex(prev => prev + 1)
  }, [currentIndex])

  const handleUndo = useCallback(() => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1
      setCurrentIndex(newIndex)
      setColors(history[newIndex])
    }
  }, [currentIndex, history])

  const handleRedo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      const newIndex = currentIndex + 1
      setCurrentIndex(newIndex)
      setColors(history[newIndex])
    }
  }, [currentIndex, history])

  const canUndo = currentIndex > 0
  const canRedo = currentIndex < history.length - 1

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader 
        colors={colors}
        onColorsChange={updateColors}
        onColorBlindnessChange={setColorBlindnessType}
        colorBlindnessType={colorBlindnessType}
        canUndo={canUndo}
        canRedo={canRedo}
        handleUndo={handleUndo}
        handleRedo={handleRedo}
      />
      <ColorPaletteGenerator 
        colors={colors}
        onChange={updateColors}
        colorBlindnessType={colorBlindnessType}
      />
      <Toaster />
    </div>
  )
}

