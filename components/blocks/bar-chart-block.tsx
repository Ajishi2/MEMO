"use client"

import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import EditingToolbar from "../editing-toolbar"

interface BarItem {
  id: string
  label: string
  value: number
  color: string
}

interface BarChartBlockProps {
  isEditMode: boolean
  onDelete: () => void
}

const colors = ["bg-green-400", "bg-yellow-400", "bg-teal-400", "bg-red-400"]

export default function BarChartBlock({ isEditMode, onDelete }: BarChartBlockProps) {
  const [bars, setBars] = useState<BarItem[]>([
    { id: "1", label: "Product A", value: 2, color: "bg-green-400" },
    { id: "2", label: "Product B", value: 7, color: "bg-yellow-400" },
    { id: "3", label: "Product C", value: 13, color: "bg-teal-400" },
    { id: "4", label: "Product D", value: 37, color: "bg-red-400" },
  ])
  const [showToolbar, setShowToolbar] = useState(false)

  const maxValue = Math.max(...bars.map((b) => b.value), 40)
  const addBar = () => {
    setBars([
      ...bars,
      { id: Date.now().toString(), label: "New Item", value: 5, color: colors[bars.length % colors.length] },
    ])
  }

  return (
    <div className="group relative">
      <div
        className={`p-8 rounded-lg border-2 ${isEditMode ? "border-dashed border-slate-300" : "border-slate-200"} bg-white transition-all ${isEditMode && showToolbar ? "ring-2 ring-blue-400" : ""}`}
        onMouseEnter={() => isEditMode && setShowToolbar(true)}
        onMouseLeave={() => setShowToolbar(false)}
      >
        <div className="space-y-8">
          <div className="w-full overflow-x-auto">
            <div className="flex items-end justify-center gap-8 h-80 pb-4 min-w-min px-4">
              {bars.map((bar) => (
                <div key={bar.id} className="flex flex-col items-center gap-2">
                  <div
                    className={`${bar.color} rounded-t-lg transition-all`}
                    style={{ width: "60px", height: `${(bar.value / maxValue) * 320}px` }}
                  />
                  <div className="text-2xl font-bold text-slate-900">{bar.value}M</div>
                  <div className="text-xs font-medium text-slate-600 text-center max-w-20">{bar.label}</div>

                  {isEditMode && (
                    <button onClick={() => setBars(bars.filter((b) => b.id !== bar.id))} className="mt-1">
                      <X className="w-3 h-3 text-red-500 hover:text-red-700" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Axis */}
          <div className="border-t-2 border-slate-300" />

          {isEditMode && (
            <Button size="sm" variant="outline" onClick={addBar} className="gap-2 bg-transparent">
              <Plus className="w-4 h-4" />
              Add Bar
            </Button>
          )}
        </div>
      </div>

      {isEditMode && showToolbar && (
        <div className="absolute -top-12 left-0 z-50">
          <EditingToolbar onDelete={onDelete} />
        </div>
      )}
    </div>
  )
}
