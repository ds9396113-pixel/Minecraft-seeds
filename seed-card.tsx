"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, Check, Heart, ChevronLeft, ChevronRight, MapPin } from "lucide-react"
import { MinecraftSeed, versionLabels, versionColors } from "@/lib/seeds"

interface SeedCardProps {
  seed: MinecraftSeed
  onClick: () => void
}

export function SeedCard({ seed, onClick }: SeedCardProps) {
  const [copied, setCopied] = useState(false)
  const [currentImage, setCurrentImage] = useState(0)

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await navigator.clipboard.writeText(seed.seed)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImage((prev) => (prev + 1) % seed.images.length)
  }

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImage((prev) => (prev - 1 + seed.images.length) % seed.images.length)
  }

  return (
    <Card
      className="group overflow-hidden cursor-pointer transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 bg-card"
      onClick={onClick}
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={seed.images[currentImage]}
          alt={seed.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        
        {seed.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex gap-1">
              {seed.images.map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    i === currentImage ? "bg-primary" : "bg-foreground/30"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className={`border ${versionColors[seed.version]}`}>
            {versionLabels[seed.version]}
          </Badge>
          <Badge variant="secondary" className="bg-background/80">
            {seed.gameVersion}
          </Badge>
        </div>

        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="font-semibold text-lg text-foreground truncate">{seed.title}</h3>
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">{seed.description}</p>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <MapPin className="w-3.5 h-3.5 text-primary" />
          <span>Spawn: {seed.spawnPoint.x}, {seed.spawnPoint.y}, {seed.spawnPoint.z}</span>
        </div>

        <div className="text-xs text-muted-foreground">
          <span className="text-primary font-medium">{seed.locations.length}</span> key locations
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <code className="text-xs bg-secondary px-2 py-1 rounded font-mono truncate text-foreground">
              {seed.seed}
            </code>
          </div>

          <Button
            size="sm"
            variant={copied ? "default" : "secondary"}
            onClick={handleCopy}
            className="ml-2 shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 mr-1" />
                Copy
              </>
            )}
          </Button>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex gap-1.5 flex-wrap">
            {seed.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Heart className="w-3.5 h-3.5 fill-current text-red-500" />
            <span className="text-xs">{seed.likes.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
