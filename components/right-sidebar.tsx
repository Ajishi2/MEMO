"use client"

import { useRef, useEffect } from "react"
import EditableWrapper from "./editable-wrapper"

interface RightSidebarProps {
  isEditMode: boolean
  data: {
    highlights: string[]
  }
  onUpdate: (updates: Partial<RightSidebarProps["data"]>) => void
}

export default function RightSidebar({ isEditMode, data, onUpdate }: RightSidebarProps) {
  const highlightRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    highlightRefs.current.forEach((ref, index) => {
      if (ref && data.highlights[index]) {
        ref.textContent = data.highlights[index]
      }
    })
  }, [data.highlights])

  const handleHighlightBlur = (index: number, newValue: string) => {
    if (isEditMode) {
      const newHighlights = [...data.highlights]
      newHighlights[index] = newValue
      onUpdate({ highlights: newHighlights })
    }
  }

  const addHighlight = () => {
    if (isEditMode) {
      onUpdate({ highlights: [...data.highlights, "New highlight"] })
    }
  }

  const removeHighlight = (index: number) => {
    if (isEditMode) {
      const newHighlights = data.highlights.filter((_, i) => i !== index)
      onUpdate({ highlights: newHighlights })
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-slate-900">Key Highlights</h3>
      <ul className="space-y-3 text-xs text-slate-700">
        {data.highlights.map((highlight, index) => (
          <li key={index} className="flex gap-2 items-start group">
            <span className="text-blue-600 font-bold flex-shrink-0">•</span>
            <EditableWrapper
              id={`highlight-${index}`}
              isEditMode={isEditMode}
              onDelete={() => removeHighlight(index)}
              onUpdate={() => {
                const ref = highlightRefs.current[index]
                if (ref) {
                  handleHighlightBlur(index, ref.textContent || highlight)
                }
              }}
            >
              <div
                ref={(el) => {
                  highlightRefs.current[index] = el
                }}
                contentEditable={isEditMode}
                suppressContentEditableWarning
                className={`flex-1 min-h-[20px] p-2 ${
                  isEditMode ? "border border-dashed border-slate-300 rounded" : ""
                }`}
                onBlur={(e) => {
                  if (isEditMode) {
                    handleHighlightBlur(index, e.currentTarget.textContent || highlight)
                  }
                }}
                onInput={() => {
                  const ref = highlightRefs.current[index]
                  if (ref && isEditMode) {
                    handleHighlightBlur(index, ref.textContent || highlight)
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && isEditMode) {
                    e.preventDefault()
                    e.currentTarget.blur()
                  }
                }}
              />
            </EditableWrapper>
          </li>
        ))}
        {isEditMode && (
          <li>
            <button
              onClick={addHighlight}
              className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1 border border-dashed border-blue-300 rounded w-full transition-colors"
            >
              + Add Highlight
            </button>
          </li>
        )}
      </ul>
    </div>
  )
}
