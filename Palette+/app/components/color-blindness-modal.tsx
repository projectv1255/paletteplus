'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

interface ColorBlindnessModalProps {
  isOpen: boolean
  onClose: () => void
  onApply: (type: string) => void
}

export function ColorBlindnessModal({ isOpen, onClose, onApply }: ColorBlindnessModalProps) {
  const options = [
    'Protanopia',
    'Deuteranopia',
    'Tritanopia',
    'Achromatopsia',
    'Protanomaly',
    'Deuteranomaly',
    'Tritanomaly',
    'Achromatomaly'
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Color blindness</DialogTitle>
          <DialogDescription>Choose a color blindness type to simulate.</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <RadioGroup defaultValue="protanopia">
            {options.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option.toLowerCase()} id={option.toLowerCase()} />
                <Label htmlFor={option.toLowerCase()}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onApply('protanopia')}>Apply</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

