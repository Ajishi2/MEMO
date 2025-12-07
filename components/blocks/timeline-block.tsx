"use client"

import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import EditableWrapper from "../editable-wrapper"

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
    const newYear = Math.max(...items.map((i) => Number.parseInt(i.year))) + 1
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        year: newYear.toString(),
        title: "New Year",
        description: "Add description",
      },
    ])
  }

  const updateItem = (id: string, field: keyof TimelineItem, value: string) => {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const deleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  return (
    <div className="relative group">
      <div
        className={`p-8 rounded-lg border-2 transition-all bg-white 
          ${isEditMode ? "border-dashed border-slate-300" : "border-slate-200"}`}
      >
        <div className="relative">
          {/* Timeline Line */}
          <div
            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-teal-400 to-purple-500"
            style={{ top: 24 }}
          />

          {/* Timeline Items */}
          <div className="flex justify-between gap-8 items-start overflow-x-auto pb-4 pt-3 relative z-10">
            {items.map((item) => (
              <div key={item.id} className="flex flex-col items-center min-w-max px-4">
                {/* Year Pill */}
                <EditableWrapper
                  id={`year-${item.id}`}
                  isEditMode={isEditMode}
                  onDelete={() => deleteItem(item.id)}
                  onUpdate={(data) => updateItem(item.id, "year", data?.innerHTML || item.year)}
                >
                  <div
                    contentEditable={isEditMode}
                    suppressContentEditableWarning
                    className={`bg-teal-500 text-white px-3 py-1 rounded-full text-xs font-semibold mb-4 cursor-text transition-all ${
                      isEditMode ? "hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-300" : ""
                    }`}
                    onBlur={(e) => updateItem(item.id, "year", e.currentTarget.textContent || item.year)}
                  >
                    {item.year}
                  </div>
                </EditableWrapper>

                {/* Dot */}
                <div className="w-3 h-3 bg-purple-500 rounded-full -mt-4 mb-4 ring-4 ring-white" />

                {/* Content */}
                <div className="mt-4 text-center max-w-32 space-y-2">
                  {/* Title */}
                  <EditableWrapper
                    id={`title-${item.id}`}
                    isEditMode={isEditMode}
                    onDelete={() => deleteItem(item.id)}
                    onUpdate={(data) => updateItem(item.id, "title", data?.innerHTML || item.title)}
                  >
                    <h3
                      contentEditable={isEditMode}
                      suppressContentEditableWarning
                      className={`font-semibold text-sm cursor-text transition-all ${
                        isEditMode
                          ? "hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-300 p-1 rounded"
                          : ""
                      }`}
                      onBlur={(e) => updateItem(item.id, "title", e.currentTarget.textContent || item.title)}
                    >
                      {item.title}
                    </h3>
                  </EditableWrapper>

                  {/* Description */}
                  <EditableWrapper
                    id={`desc-${item.id}`}
                    isEditMode={isEditMode}
                    onDelete={() => deleteItem(item.id)}
                    onUpdate={(data) => updateItem(item.id, "description", data?.innerHTML || item.description)}
                  >
                    <p
                      contentEditable={isEditMode}
                      suppressContentEditableWarning
                      className={`text-xs text-slate-600 leading-relaxed cursor-text transition-all ${
                        isEditMode
                          ? "hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-300 p-1 rounded"
                          : ""
                      }`}
                      onBlur={(e) =>
                        updateItem(item.id, "description", e.currentTarget.textContent || item.description)
                      }
                    >
                      {item.description}
                    </p>
                  </EditableWrapper>
                </div>

                {isEditMode && (
                  <button className="mt-2 hover:scale-110 transition" onClick={() => deleteItem(item.id)}>
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
    </div>
  )
}
