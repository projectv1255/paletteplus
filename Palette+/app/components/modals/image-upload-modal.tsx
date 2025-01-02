'use client'

import { useState, useRef, useCallback } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Upload, Link2, Camera, Image, Loader2 } from 'lucide-react'
import { extractColorsFromImage } from '@/lib/utils/color-utils'
import Webcam from 'react-webcam'
import { toast } from '@/components/ui/use-toast'

interface ImageUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onUpload: (colors: string[]) => void
}

export function ImageUploadModal({ isOpen, onClose, onUpload }: ImageUploadModalProps) {
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const webcamRef = useRef<Webcam>(null)

  const processImage = async (imageSource: string) => {
    setLoading(true)
    try {
      const colors = await extractColorsFromImage(imageSource)
      onUpload(colors) // This will now directly update the parent state
      onClose()
      toast({
        title: "Colors extracted",
        description: "Your palette has been updated with colors from the image."
      })
    } catch (error) {
      console.error('Error processing image:', error)
      toast({
        title: "Error",
        description: "Failed to process the image. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (file: File) => {
    const url = URL.createObjectURL(file)
    await processImage(url)
  }

  const handleUrlSubmit = async () => {
    if (!imageUrl) return
    await processImage(imageUrl)
  }

  const captureImage = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot()
    if (imageSrc) {
      setCapturedImage(imageSrc)
    }
  }, [])

  const handleCameraUpload = async () => {
    if (!capturedImage) return
    await processImage(capturedImage)
  }

  const handleStockImageSelect = async (imageUrl: string) => {
    await processImage(imageUrl)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select image</DialogTitle>
          <DialogDescription>Choose an image to extract colors from.</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="upload">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="url">URL</TabsTrigger>
            <TabsTrigger value="camera">Camera</TabsTrigger>
            <TabsTrigger value="stock">Stock</TabsTrigger>
          </TabsList>
          <TabsContent value="upload" className="py-4">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFileUpload(file)
              }}
            />
            <div 
              className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">Browse or drop image</p>
            </div>
          </TabsContent>
          <TabsContent value="url" className="py-4">
            <div className="space-y-4">
              <Input
                type="url"
                placeholder="Paste image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              <Button 
                className="w-full" 
                onClick={handleUrlSubmit}
                disabled={!imageUrl || loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Extract Colors'
                )}
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="camera" className="py-4">
            <div className="space-y-4">
              {capturedImage ? (
                <div className="relative">
                  <img src={capturedImage} alt="Captured" className="w-full rounded-lg" />
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => setCapturedImage(null)}
                  >
                    Retake
                  </Button>
                </div>
              ) : (
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{ facingMode: 'user' }}
                  className="w-full rounded-lg"
                />
              )}
              {capturedImage ? (
                <Button className="w-full" onClick={handleCameraUpload} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Use This Photo'
                  )}
                </Button>
              ) : (
                <Button className="w-full" onClick={captureImage}>
                  Capture Photo
                </Button>
              )}
            </div>
          </TabsContent>
          <TabsContent value="stock" className="py-4">
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((index) => (
                <div
                  key={index}
                  className="relative cursor-pointer group"
                  onClick={() => handleStockImageSelect(`/placeholder.svg?height=150&width=150`)}
                >
                  <img 
                    src={`/placeholder.svg?height=150&width=150`} 
                    alt={`Stock ${index}`} 
                    className="w-full h-auto rounded-lg" 
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                    <Button variant="secondary" size="sm">
                      Select
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

