"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Clipboard } from "lucide-react"

interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
}

export function SearchBar({ onSearch, placeholder = "Enter or paste a seed..." }: SearchBarProps) {
  const [query, setQuery] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query)
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setQuery(text)
      onSearch(text)
    } catch {
      console.log("Unable to read clipboard")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-2xl">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="pl-10 h-12 bg-secondary border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
        />
      </div>
      <Button
        type="button"
        variant="secondary"
        size="lg"
        onClick={handlePaste}
        className="h-12 px-4"
      >
        <Clipboard className="w-5 h-5 mr-2" />
        Paste
      </Button>
      <Button type="submit" size="lg" className="h-12 px-6 bg-primary text-primary-foreground hover:bg-primary/90">
        <Search className="w-5 h-5 mr-2" />
        Search
      </Button>
    </form>
  )
}
