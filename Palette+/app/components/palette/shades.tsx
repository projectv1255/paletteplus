'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface ShadesProps {
  baseColor: string
  onSelectShade: (color: string) => void
}

export function Shades({ baseColor, onSelectShade }: ShadesProps) {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null)
  
  const steps = Array.from({ length: 20 }, (_, i) => {
    const percent = (i - 10) * 10
    const color = adjustColor(baseColor, percent)
    return { color, step: percent }
  })

  return (
    <div className="absolute inset-0 flex flex-col">
      {steps.map(({ color, step }, index) => (
        <button
          key={step}
          className={cn(
            "flex-1 group relative transition-all duration-200",
            hoveredStep !== null && hoveredStep !== index && "opacity-75"
          )}
          style={{ backgroundColor: color }}
          onClick={() => onSelectShade(color)}
          onMouseEnter={() => setHoveredStep(index)}
          onMouseLeave={() => setHoveredStep(null)}
        >
          <span className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-xs text-white font-mono">
            {step > 0 ? `+${step}` : step}
          </span>
        </button>
      ))}
    </div>
  )
}

function adjustColor(hex: string, percent: number): string {
  let r = parseInt(hex.slice(1, 3), 16)
  let g = parseInt(hex.slice(3, 5), 16)
  let b = parseInt(hex.slice(5, 7), 16)

  if (percent > 0) {
    r = Math.round(r + ((255 - r) * percent) / 100)
    g = Math.round(g + ((255 - g) * percent) / 100)
    b = Math.round(b + ((255 - b) * percent) / 100)
  } else {
    r = Math.round(r * (100 + percent) / 100)
    g = Math.round(g * (100 + percent) / 100)
    b = Math.round(b * (100 + percent) / 100)
  }

  return `#${[r, g, b].map(x => {
    const hex = Math.max(0, Math.min(255, x)).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')}`
}

