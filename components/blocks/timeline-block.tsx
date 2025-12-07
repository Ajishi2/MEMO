"use client"

import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import EditingToolbar from "../editing-toolbar"

interface TimelineItem {
  id: string
  year: string
  title: string
  description: string
}

interface TimelineBlockProps {
  isEditMode: boolean
  onDelete: () => void
}

export default function TimelineBlock({ isEditMode, onDelete }: TimelineBlockProps) {
  const [items, setItems] = useState<TimelineItem[]>([
    { id: "1", year: "2019", title: "Foundation", description: "Company established with core mission" },
    { id: "2", year: "2020", title: "Growth Phase", description: "Expanded team and product offerings" },
    { id: "3", year: "2021", title: "Market Leader", description: "Became industry leader in innovation" },
    { id: "4", year: "2022", title: "Global Scale", description: "Expanded to 15+ countries" },
    { id: "5", year: "2023", title: "New Heights", description: "Record revenue and customer satisfaction" },
  ])

  const addYear = () => {
    const newYear = Math.max(...items.map(i => parseInt(i.year))) + 1
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        year: newYear.toString(),
        title: "New Year",
        description: "Add description"
      }
    ])
  }

  return (
    <div className="relative group">

      <div
        className={`p-8 rounded-lg border-2 transition-all bg-white 
          ${isEditMode ? "border-dashed border-slate-300" : "border-slate-200"}`}
      >
        <div className="relative">

          {/* Timeline Line */}
          <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-teal-400 to-purple-500" style={{ top: 24 }} />

          {/* Timeline Items */}
          <div className="flex justify-between gap-8 items-start overflow-x-auto pb-4 pt-3 relative z-10">
            {items.map(item => (
              <div key={item.id} className="flex flex-col items-center min-w-max px-4">

                {/* Year Pill */}
                <div className="bg-teal-500 text-white px-3 py-1 rounded-full text-xs font-semibold mb-4">
                  {item.year}
                </div>

                {/* Dot */}
                <div className="w-3 h-3 bg-purple-500 rounded-full -mt-4 mb-4 ring-4 ring-white" />

                {/* Content */}
                <div className="mt-4 text-center max-w-32">
                  <h3 className="font-semibold text-sm">{item.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.description}</p>
                </div>

                {isEditMode && (
                  <button
                    className="mt-2 hover:scale-110 transition"
                    onClick={() => setItems(items.filter(i => i.id !== item.id))}
                  >
                    <X className="w-4 h-4 text-red-500 hover:text-red-700" />
                  </button>
                )}

              </div>
            ))}
          </div>

          {isEditMode && (
            <Button size="sm" variant="outline" onClick={addYear} className="mt-6 gap-2 bg-transparent">
              <Plus className="w-4 h-4" />
              Add Year
            </Button>
          )}

        </div>
      </div>

      {/* Floating Toolbar */}
      {isEditMode && (
        <div
          className="
            absolute -top-12 left-1/2 -translate-x-1/2
            hidden group-hover:flex hover:flex
            pointer-events-auto
            z-50
          "
        >
          <EditingToolbar onDelete={onDelete} />
        </div>
      )}

    </div>
  )
}
