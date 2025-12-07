"use client"

import { useRef, useEffect } from "react"
import { Sparkles, Plus, X } from "lucide-react"
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
    <div className="pt-8 px-4 pb-6 space-y-6">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white px-5 py-3 rounded-xl shadow-lg border border-slate-700/50 overflow-hidden group">
        {/* Animated background accent */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/20 to-transparent rounded-bl-full blur-2xl" />
        
        <div className="relative flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Key Highlights
          </h3>
        </div>
      </div>

      {/* Highlights List */}
      <div className="bg-gradient-to-br from-white to-slate-50 p-5 rounded-xl border border-slate-200/80 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <ul className="space-y-4">
          {data.highlights.map((highlight, index) => (
            <li key={index} className="flex gap-3 items-start group/item">
              <span className="text-blue-600 font-bold text-base flex-shrink-0 mt-0.5">•</span>
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
                  className={`flex-1 min-h-[24px] p-2 font-semibold text-sm text-slate-700 leading-relaxed rounded-lg ${
                    isEditMode 
                      ? "border border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/30 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:bg-white/50 transition-all outline-none" 
                      : ""
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
          
          {data.highlights.length === 0 && (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-slate-500 text-xs font-medium">No highlights added yet</p>
            </div>
          )}
          
          {isEditMode && (
            <li>
              <button
                onClick={addHighlight}
                className="w-full py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-blue-400 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-300 flex items-center justify-center gap-2 group/btn text-sm font-medium"
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg group-hover/btn:scale-110 transition-transform">
                  <Plus className="w-3 h-3 text-white" />
                </div>
                <span>Add Highlight</span>
              </button>
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}