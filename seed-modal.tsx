"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, Check, Heart, ChevronLeft, ChevronRight, MapPin, Navigation } from "lucide-react"
import { MinecraftSeed, versionLabels, versionColors, Location } from "@/lib/seeds"

interface SeedModalProps {
  seed: MinecraftSeed | null
  open: boolean
  onClose: () => void
}

function LocationCard({ location, onCopy }: { location: Location; onCopy: (text: string) => void }) {
  const coordString = `${location.coordinates.x} ${location.coordinates.y} ${location.coordinates.z}`
  
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border hover:border-primary/30 transition-colors">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-md bg-primary/10">
          <MapPin className="w-4 h-4 text-primary" />
        </div>
        <div>
          <p className="font-medium text-sm text-foreground">{location.name}</p>
          <p className="text-xs text-muted-foreground">{location.biome}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <code className="text-xs font-mono bg-background px-2 py-1 rounded text-muted-foreground">
          {coordString}
        </code>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onCopy(`/tp @p ${coordString}`)}
          className="h-7 px-2"
        >
          <Copy className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  )
}

export function SeedModal({ seed, open, onClose }: SeedModalProps) {
  const [copied, setCopied] = useState(false)
  const [copiedCoord, setCopiedCoord] = useState<string | null>(null)
  const [currentImage, setCurrentImage] = useState(0)

  if (!seed) return null

  const handleCopy = async () => {
    await navigator.clipboard.writeText(seed.seed)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCopyCoord = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedCoord(text)
    setTimeout(() => setCopiedCoord(null), 2000)
  }

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % seed.images.length)
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + seed.images.length) % seed.images.length)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 bg-card border-border">
        <div className="relative">
          <div className="relative aspect-video">
            <img
              src={seed.images[currentImage]}
              alt={seed.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />

            {seed.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            <div className="absolute top-4 left-4 flex gap-2">
              <Badge className={`border ${versionColors[seed.version]}`}>
                {versionLabels[seed.version]}
              </Badge>
              <Badge variant="secondary" className="bg-background/80">
                {seed.gameVersion}
              </Badge>
            </div>
          </div>

          {seed.images.length > 1 && (
            <div className="flex gap-2 p-4 overflow-x-auto">
              {seed.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  className={`relative w-20 h-14 rounded-md overflow-hidden shrink-0 border-2 transition-colors ${
                    i === currentImage
                      ? "border-primary"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Preview ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 space-y-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-foreground">
              {seed.title}
            </DialogTitle>
          </DialogHeader>

          <p className="text-muted-foreground">{seed.description}</p>

          {/* Seed Copy Section */}
          <div className="flex items-center gap-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-1">Seed</p>
              <code className="text-lg font-mono font-semibold text-primary">
                {seed.seed}
              </code>
            </div>
            <Button
              size="lg"
              onClick={handleCopy}
              className={copied ? "bg-primary text-primary-foreground" : ""}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Seed
                </>
              )}
            </Button>
          </div>

          {/* Spawn Point */}
          <div className="p-4 rounded-lg bg-secondary/50 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Navigation className="w-4 h-4 text-primary" />
              <span className="font-medium text-foreground">Spawn Point</span>
            </div>
            <div className="flex items-center justify-between">
              <code className="text-sm font-mono text-muted-foreground">
                X: {seed.spawnPoint.x} &nbsp; Y: {seed.spawnPoint.y} &nbsp; Z: {seed.spawnPoint.z}
              </code>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleCopyCoord(`/tp @p ${seed.spawnPoint.x} ${seed.spawnPoint.y} ${seed.spawnPoint.z}`)}
              >
                <Copy className="w-3.5 h-3.5 mr-1" />
                Copy TP Command
              </Button>
            </div>
          </div>

          {/* Key Locations */}
          <div>
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              Key Locations ({seed.locations.length})
            </h3>
            <div className="space-y-2">
              {seed.locations.map((location, index) => (
                <LocationCard key={index} location={location} onCopy={handleCopyCoord} />
              ))}
            </div>
            {copiedCoord && (
              <p className="text-xs text-primary mt-2">TP command copied to clipboard!</p>
            )}
          </div>

          {/* Tags and Likes */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex gap-2 flex-wrap">
              {seed.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-sm px-3 py-1 rounded-full bg-secondary text-muted-foreground"
                >
                  #{tag}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Heart className="w-5 h-5 fill-current text-red-500" />
              <span className="font-semibold">
                {seed.likes.toLocaleString()} likes
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
