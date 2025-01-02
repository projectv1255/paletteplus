'use client'

import { useState, useCallback } from 'react'
import { HexColorPicker } from 'react-colorful'
import { ColorToolbar } from './color-toolbar'
import { Shades } from './shades'
import { useDrop } from 'react-dnd'
import { cn } from '@/lib/utils'

interface ColorSwatchProps {
  color: string
  originalColor: string
  name: string
  isLocked: boolean
  onToggleLock: () => void
  onColorChange: (newColor: string) => void
  onRemove?: () => void
  index: number
  onSwap: (fromIndex: number, toIndex: number) => void
}

export default function ColorSwatch({ 
  color, 
  originalColor,
  name, 
  isLocked, 
  onToggleLock, 
  onColorChange,
  onRemove,
  index,
  onSwap
}: ColorSwatchProps) {
  const [showPicker, setShowPicker] = useState(false)
  const [showShades, setShowShades] = useState(false)

  const handlePickerToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setShowPicker(!showPicker)
    setShowShades(false)
  }, [showPicker])

  const handleShadeSelect = useCallback((newColor: string) => {
    onColorChange(newColor)
    setShowShades(false)
  }, [onColorChange])

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'COLOR',
    drop: (item: { color: string; index: number }) => {
      if (item.index !== index) {
        onSwap(item.index, index)
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  }), [index, onSwap])

  return (
    <div 
      ref={drop}
      className={cn(
        "flex-1 relative group cursor-pointer min-h-[120px] sm:min-h-0",
        isOver && "opacity-75"
      )}
      style={{ backgroundColor: color }}
    >
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{
          background: `linear-gradient(to bottom, transparent 0%, ${color}99 50%, ${color} 100%)`
        }}
      />

      <ColorToolbar
        color={originalColor}
        index={index}
        isLocked={isLocked}
        onToggleLock={onToggleLock}
        onRemove={onRemove || (() => {})}
        onBrightnessClick={() => setShowShades(!showShades)}
        className="absolute left-2 top-1/2 -translate-y-1/2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
        isShadePickerActive={showShades}
      />

      {showShades && (
        <Shades 
          baseColor={originalColor} 
          onSelectShade={handleShadeSelect}
        />
      )}

      <div className="absolute inset-x-0 bottom-0 p-2 sm:p-6 flex flex-col items-center text-white z-10">
        <button
          onClick={handlePickerToggle}
          className="text-lg sm:text-3xl font-mono font-bold uppercase mb-1 sm:mb-2"
        >
          {originalColor}
        </button>
        <span className="text-xs sm:text-sm opacity-80">{name}</span>
      </div>

      {showPicker && (
        <div 
          className="absolute bottom-16 sm:bottom-32 left-1/2 -translate-x-1/2 z-20 scale-75 sm:scale-100 origin-bottom"
          onClick={(e) => e.stopPropagation()}
        >
          <HexColorPicker 
            color={originalColor} 
            onChange={(newColor) => {
              onColorChange(newColor)
              setShowShades(false)
            }} 
          />
        </div>
      )}

      {color !== originalColor && (
        <div className="absolute top-2 right-2 bg-white text-black text-xs px-2 py-1 rounded-full">
          Симульовано
        </div>
      )}
    </div>
  )
}

