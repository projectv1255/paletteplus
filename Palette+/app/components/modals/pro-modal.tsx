'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'

interface ProModalProps {
  isOpen: boolean
  onClose: () => void
}

interface PricingPlan {
  name: string
  price: string
  features: string[]
  buttonText: string
}

const pricingPlans: PricingPlan[] = [
  {
    name: 'Basic',
    price: '$9.99/month',
    features: [
      'Unlimited palette saves',
      'Ad-free experience',
      'Export in high resolution',
    ],
    buttonText: 'Choose Basic',
  },
  {
    name: 'Pro',
    price: '$19.99/month',
    features: [
      'All Basic features',
      'Advanced color theory tools',
      'Custom color libraries',
      'Team collaboration',
    ],
    buttonText: 'Choose Pro',
  },
  {
    name: 'Enterprise',
    price: 'Contact us',
    features: [
      'All Pro features',
      'Dedicated support',
      'API access',
      'Custom integrations',
    ],
    buttonText: 'Contact Sales',
  },
]

export function ProModal({ isOpen, onClose }: ProModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  const handlePlanSelection = (planName: string) => {
    setSelectedPlan(planName)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">Upgrade to Palette+ Pro</DialogTitle>
          <DialogDescription>Choose a plan to unlock advanced features.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className="border rounded-lg p-6 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <p className="text-2xl font-bold mb-4">{plan.price}</p>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Button
                className="mt-6"
                onClick={() => handlePlanSelection(plan.name)}
              >
                {plan.buttonText}
              </Button>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

