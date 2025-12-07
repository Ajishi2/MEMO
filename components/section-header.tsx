"use client"

import { Plus, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SectionHeaderProps {
  title: string
  isEditMode: boolean
  isSelected: boolean
  onSelect: () => void
  onAddBlock: (type: string) => void
}

export default function SectionHeader({ title, isEditMode, isSelected, onSelect, onAddBlock }: SectionHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="relative group">
        <div className="bg-slate-900 text-white px-4 py-3 rounded-lg flex items-center gap-3">
          <h2 className="text-sm font-semibold">{title}</h2>
        </div>

        {isEditMode && (
          <div className="absolute top-12 left-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-10">
            <button className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-100 rounded w-full">
              <span>Rename</span>
            </button>
            <button className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-100 rounded w-full">
              <Copy className="w-4 h-4" />
              <span>Duplicate</span>
            </button>
          </div>
        )}
      </div>

      {isEditMode && isSelected && (
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => onAddBlock("text")} className="gap-2">
            <Plus className="w-4 h-4" />
            Text
          </Button>
          <Button size="sm" variant="outline" onClick={() => onAddBlock("chart")} className="gap-2">
            <Plus className="w-4 h-4" />
            Chart
          </Button>
          <Button size="sm" variant="outline" onClick={() => onAddBlock("table")} className="gap-2">
            <Plus className="w-4 h-4" />
            Table
          </Button>
          <Button size="sm" variant="outline" onClick={() => onAddBlock("timeline")} className="gap-2">
            <Plus className="w-4 h-4" />
            Timeline
          </Button>
          <Button size="sm" variant="outline" onClick={() => onAddBlock("bar-chart")} className="gap-2">
            <Plus className="w-4 h-4" />
            Bars
          </Button>
        </div>
      )}
    </div>
  )
}
