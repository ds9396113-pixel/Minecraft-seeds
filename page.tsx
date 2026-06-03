"use client"

import { useState, useMemo } from "react"
import { SearchBar } from "@/components/search-bar"
import { VersionFilter } from "@/components/version-filter"
import { SeedCard } from "@/components/seed-card"
import { SeedModal } from "@/components/seed-modal"
import { sampleSeeds, MinecraftSeed, MinecraftVersion } from "@/lib/seeds"
import { Boxes, Sparkles } from "lucide-react"

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedVersion, setSelectedVersion] = useState<MinecraftVersion | "all">("all")
  const [selectedSeed, setSelectedSeed] = useState<MinecraftSeed | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const filteredSeeds = useMemo(() => {
    return sampleSeeds.filter((seed) => {
      const matchesVersion = selectedVersion === "all" || seed.version === selectedVersion
      const matchesSearch =
        searchQuery === "" ||
        seed.seed.toLowerCase().includes(searchQuery.toLowerCase()) ||
        seed.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        seed.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchesVersion && matchesSearch
    })
  }, [searchQuery, selectedVersion])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleSeedClick = (seed: MinecraftSeed) => {
    setSelectedSeed(seed)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setSelectedSeed(null)
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="relative max-w-6xl mx-auto text-center space-y-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Boxes className="w-10 h-10 md:w-12 md:h-12 text-primary" />
            <h1 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight text-balance">
              Minecraft Seeds
            </h1>
          </div>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Discover and share amazing seeds for Java, Bedrock, Pocket Edition, and Beta versions. 
            Browse screenshots and copy seeds instantly.
          </p>
          
          <div className="flex justify-center">
            <SearchBar onSearch={handleSearch} />
          </div>

          <VersionFilter selected={selectedVersion} onSelect={setSelectedVersion} />
        </div>
      </section>

      {/* Seeds Grid */}
      <section className="px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                {searchQuery
                  ? `Results for "${searchQuery}"`
                  : selectedVersion === "all"
                  ? "Popular Seeds"
                  : `${selectedVersion.charAt(0).toUpperCase() + selectedVersion.slice(1)} Seeds`}
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">
              {filteredSeeds.length} seed{filteredSeeds.length !== 1 ? "s" : ""} found
            </p>
          </div>

          {filteredSeeds.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredSeeds.map((seed) => (
                <SeedCard
                  key={seed.id}
                  seed={seed}
                  onClick={() => handleSeedClick(seed)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Boxes className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No seeds found</h3>
              <p className="text-muted-foreground">
                Try a different search term or filter.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            Minecraft is a trademark of Mojang Synergies AB. This site is not affiliated with Mojang.
          </p>
        </div>
      </footer>

      {/* Seed Modal */}
      <SeedModal seed={selectedSeed} open={modalOpen} onClose={handleCloseModal} />
    </main>
  )
}
