'use client'

import { Copy, Heart, GripHorizontal, X, Circle, Lock, Unlock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { useState, useCallback, useEffect } from 'react'
import { useDrag } from 'react-dnd'
import { getFavoriteColors, addFavoriteColor, removeFavoriteColor, isFavoriteColor } from '@/lib/utils/favorites-utils'

interface ColorToolbarProps {
  color: string
  index: number
  isLocked: boolean
  onToggleLock: () => void
  onRemove: () => void
  onBrightnessClick: () => void
  className?: string
  isShadePickerActive: boolean
}

export function ColorToolbar({
  color,
  index,
  isLocked,
  onToggleLock,
  onRemove,
  onBrightnessClick,
  className,
  isShadePickerActive
}: ColorToolbarProps) {
  const [isFavorite, setIsFavorite] = useState(false)

  // Check if color is favorite on mount
  useEffect(() => {
    setIsFavorite(isFavoriteColor(color))
  }, [color])

  const handleCopyClick = useCallback(() => {
    navigator.clipboard.writeText(color)
    toast({
      title: "Color copied",
      description: `${color} has been copied to your clipboard.`
    })
  }, [color])

  const handleFavoriteClick = useCallback(() => {
    if (isFavorite) {
      removeFavoriteColor(color)
      setIsFavorite(false)
      toast({
        title: "Removed from favorites",
        description: `${color} has been removed from your favorites.`,
        action: (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              addFavoriteColor(color)
              setIsFavorite(true)
            }}
          >
            Undo
          </Button>
        )
      })
    } else {
      addFavoriteColor(color)
      setIsFavorite(true)
      toast({
        title: "Added to favorites",
        description: `${color} has been added to your favorites.`
      })
    }
  }, [color, isFavorite])

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'COLOR',
    item: { color, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }))

  return (
    <div className={cn(
      "flex sm:flex-col items-center gap-1 sm:gap-2 p-1 sm:p-2",
      isDragging && "opacity-50",
      className
    )}>
      <Button
        variant="ghost"
        size="icon"
        onClick={onRemove}
        className={cn(
          "hover:bg-white/20 h-8 w-8 sm:h-10 sm:w-10",
          isShadePickerActive && "text-white"
        )}
      >
        <X className="h-4 w-4 sm:h-5 sm:w-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onBrightnessClick}
        className={cn(
          "hover:bg-white/20 h-8 w-8 sm:h-10 sm:w-10",
          isShadePickerActive && "text-white"
        )}
      >
        <Circle className="h-4 w-4 sm:h-5 sm:w-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleFavoriteClick}
        className={cn(
          "hover:bg-white/20 h-8 w-8 sm:h-10 sm:w-10",
          isFavorite && "text-red-500",
          isShadePickerActive && "text-white"
        )}
      >
        <Heart className="h-4 w-4 sm:h-5 sm:w-5" fill={isFavorite ? "currentColor" : "none"} />
      </Button>
      <div ref={drag}>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "cursor-grab active:cursor-grabbing hover:bg-white/20 h-8 w-8 sm:h-10 sm:w-10",
            isShadePickerActive && "text-white"
          )}
        >
          <GripHorizontal className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleCopyClick}
        className={cn(
          "hover:bg-white/20 h-8 w-8 sm:h-10 sm:w-10",
          isShadePickerActive && "text-white"
        )}
      >
        <Copy className="h-4 w-4 sm:h-5 sm:w-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleLock}
        className={cn(
          "hover:bg-white/20 h-8 w-8 sm:h-10 sm:w-10",
          isShadePickerActive && "text-white"
        )}
      >
        {isLocked ? (
          <Lock className="h-4 w-4 sm:h-5 sm:w-5" />
        ) : (
          <Unlock className="h-4 w-4 sm:h-5 sm:w-5" />
        )}
      </Button>
    </div>
  )
}

