"use client"

import { Button } from "@/components/ui/button"
import { MinecraftVersion, versionLabels } from "@/lib/seeds"
import { Gamepad2 } from "lucide-react"

interface VersionFilterProps {
  selected: MinecraftVersion | "all"
  onSelect: (version: MinecraftVersion | "all") => void
}

const versions: (MinecraftVersion | "all")[] = ["all", "java", "bedrock", "pocket", "beta"]

export function VersionFilter({ selected, onSelect }: VersionFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {versions.map((version) => (
        <Button
          key={version}
          variant={selected === version ? "default" : "secondary"}
          onClick={() => onSelect(version)}
          className={`${
            selected === version
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          {version === "all" ? (
            <>
              <Gamepad2 className="w-4 h-4 mr-2" />
              All Versions
            </>
          ) : (
            versionLabels[version]
          )}
        </Button>
      ))}
    </div>
  )
}
