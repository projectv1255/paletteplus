'use client'

import { useState, useEffect, useCallback } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import ColorSwatch from './color-swatch'
import { generatePalette, getColorName, simulateColorBlindness } from '@/lib/utils/color-utils'

export interface ColorPaletteGeneratorProps {
  colors: string[] // Changed from initialColors to colors
  onChange: (colors: string[]) => void
  colorBlindnessType: string | null
}

export default function ColorPaletteGenerator({ 
  colors,
  onChange,
  colorBlindnessType,
}: ColorPaletteGeneratorProps) {
  const [lockedColors, setLockedColors] = useState(Array(colors.length).fill(false))

  // Remove local colors state and history management as it's now handled by parent
  
  const generateNewPalette = useCallback(() => {
    const newColors = colors.map((color, index) => 
      lockedColors[index] ? color : generatePalette(1)[0]
    )
    onChange(newColors)
  }, [colors, lockedColors, onChange])

  const toggleLock = useCallback((index: number) => {
    setLockedColors(prevLocked => {
      const newLocked = [...prevLocked]
      newLocked[index] = !newLocked[index]
      return newLocked
    })
  }, [])

  const updateColor = useCallback((index: number, newColor: string) => {
    onChange(colors.map((color, i) => 
      i === index ? newColor : color
    ))
  }, [colors, onChange])

  const removeColor = useCallback((index: number) => {
    if (colors.length > 3) { // Minimum 3 colors
      const newColors = colors.filter((_, i) => i !== index)
      onChange(newColors)
      setLockedColors(prev => prev.filter((_, i) => i !== index))
    }
  }, [colors, onChange])

  const swapColors = useCallback((fromIndex: number, toIndex: number) => {
    const newColors = [...colors]
    const newLocked = [...lockedColors]
    ;[newColors[fromIndex], newColors[toIndex]] = [newColors[toIndex], newColors[fromIndex]]
    ;[newLocked[fromIndex], newLocked[toIndex]] = [newLocked[toIndex], newLocked[fromIndex]]
    onChange(newColors)
    setLockedColors(newLocked)
  }, [colors, lockedColors, onChange])

  const getDisplayColors = useCallback(() => {
    if (!colorBlindnessType) return colors
    return colors.map(color => simulateColorBlindness(color, colorBlindnessType))
  }, [colors, colorBlindnessType])

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault()
        generateNewPalette()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [generateNewPalette])

  const displayColors = getDisplayColors()

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex-1 flex flex-col sm:flex-row">
        {displayColors.map((color, index) => (
          <ColorSwatch
            key={`${color}-${index}`} // Added color to key to force re-render
            index={index}
            color={color}
            originalColor={colors[index]}
            name={getColorName(colors[index])}
            isLocked={lockedColors[index]}
            onToggleLock={() => toggleLock(index)}
            onColorChange={(newColor) => updateColor(index, newColor)}
            onRemove={() => removeColor(index)}
            onSwap={swapColors}
            className="flex-1 min-h-[120px] sm:min-h-0"
          />
        ))}
      </div>
    </DndProvider>
  )
}

