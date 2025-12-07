"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Plus, Sparkles } from "lucide-react"
import TextBlock from "./blocks/text-block"
import ChartBlock from "./blocks/chart-block"
import TableBlock from "./blocks/table-block"
import TimelineBlock from "./blocks/timeline-block"
import BarChartBlock from "./blocks/bar-chart-block"

interface Section {
  id: string
  title: string
  blocks: BlockItem[]
}

interface BlockItem {
  id: string
  type: "text" | "chart" | "table" | "timeline" | "bar-chart"
  data?: any
}

// Editable Section Header Component
function EditableSectionHeader({
  section,
  isEditMode,
  onUpdate,
  onAddBlock,
}: {
  section: Section
  isEditMode: boolean
  onUpdate: (title: string) => void
  onAddBlock: (type: BlockItem["type"]) => void
}) {
  const headerRef = useRef<HTMLHeadingElement>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (headerRef.current && !isInitialized) {
      headerRef.current.textContent = section.title
      setIsInitialized(true)
    }
  }, [section.title, isInitialized])

  return (
    <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white px-6 py-4 rounded-xl shadow-lg border border-slate-700/50 overflow-hidden group">
      {/* Animated background accent */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-transparent rounded-bl-full blur-2xl" />
      
      <div className="relative flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <Sparkles className="w-5 h-5 text-blue-400" />
          {isEditMode ? (
            <h2
              ref={headerRef}
              contentEditable
              suppressContentEditableWarning
              className="text-lg font-bold outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 rounded-lg px-3 py-1.5 -mx-3 -my-1.5 min-w-[200px] flex-1 bg-white/5 focus:bg-white/10 transition-all"
              onBlur={(e) => {
                const newTitle = e.currentTarget.textContent || section.title
                if (newTitle.trim() !== section.title) {
                  onUpdate(newTitle.trim() || section.title)
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  e.currentTarget.blur()
                }
              }}
            />
          ) : (
            <h2 className="text-lg font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              {section.title}
            </h2>
          )}
        </div>
        
        {isEditMode && (
          <div className="relative group/menu flex-shrink-0">
            <button className="text-sm px-4 py-2 bg-gradient-to-r from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-lg hover:from-blue-500/30 hover:to-blue-600/30 border border-blue-400/30 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-blue-500/20 hover:scale-105">
              <Plus className="w-4 h-4" />
              <span className="font-medium">Add Block</span>
            </button>
            <div className="absolute right-0 top-full mt-2 w-40 bg-white text-slate-900 rounded-xl shadow-2xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all duration-200 z-10 overflow-hidden border border-slate-200">
              {(["text", "chart", "table", "timeline", "bar-chart"] as const).map((type, idx) => (
                <button
                  key={type}
                  onClick={() => onAddBlock(type)}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all capitalize font-medium flex items-center gap-2 group/item"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                  {type === "bar-chart" ? "Bar Chart" : type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


interface MemoContentProps {
  isEditMode: boolean
  sections: Section[]
  onSectionsChange: (sections: Section[]) => void
}

export default function MemoContent({ isEditMode, sections, onSectionsChange }: MemoContentProps) {
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null)

  const addSection = () => {
    const newSection = {
      id: `section-${Date.now()}`,
      title: `Section ${sections.length + 1}`,
      blocks: [],
    }
    onSectionsChange([...sections, newSection])
  }

  const addBlock = (sectionId: string, type: BlockItem["type"]) => {
    onSectionsChange(
      sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              blocks: [
                ...s.blocks,
                {
                  id: `block-${Date.now()}`,
                  type,
                  data: type === "text" ? { content: "" } : {},
                },
              ],
            }
          : s,
      ),
    )
  }

  const deleteBlock = (sectionId: string, blockId: string) => {
    onSectionsChange(
      sections.map((s) => (s.id === sectionId ? { ...s, blocks: s.blocks.filter((b) => b.id !== blockId) } : s)),
    )
  }

  const handleDragStart = (e: React.DragEvent, blockId: string) => {
    setDraggedBlockId(blockId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const renderBlock = (block: BlockItem, sectionId: string) => {
    const commonProps = {
      id: block.id,
      isEditMode,
      onDelete: () => deleteBlock(sectionId, block.id),
      onDragStart: (e: React.DragEvent) => handleDragStart(e, block.id),
      onDragOver: handleDragOver,
    }

    switch (block.type) {
      case "text":
        return (
          <TextBlock
            key={block.id}
            {...commonProps}
            data={block.data}
            onUpdate={(content: string) => {
              onSectionsChange(
                sections.map((s) =>
                  s.id === sectionId
                    ? {
                        ...s,
                        blocks: s.blocks.map((b) => (b.id === block.id ? { ...b, data: { content } } : b)),
                      }
                    : s,
                ),
              )
            }}
          />
        )
      case "chart":
        return <ChartBlock key={block.id} {...commonProps} />
      case "table":
        return (
          <TableBlock
            key={block.id}
            {...commonProps}
            data={block.data}
            onUpdate={(tableData: string[][]) => {
              onSectionsChange(
                sections.map((s) =>
                  s.id === sectionId
                    ? {
                        ...s,
                        blocks: s.blocks.map((b) => (b.id === block.id ? { ...b, data: tableData } : b)),
                      }
                    : s,
                ),
              )
            }}
          />
        )
      case "timeline":
        return <TimelineBlock key={block.id} {...commonProps} />
      case "bar-chart":
        return <BarChartBlock key={block.id} {...commonProps} />
      default:
        return null
    }
  }

  const updateSectionTitle = (sectionId: string, newTitle: string) => {
    onSectionsChange(
      sections.map((s) => (s.id === sectionId ? { ...s, title: newTitle } : s))
    )
  }

  return (
    <div className="bg-gradient-to-b from-white to-slate-50 p-8 space-y-8 min-h-screen">
      {sections.map((section, idx) => (
        <div 
          key={section.id} 
          className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500"
          style={{ animationDelay: `${idx * 100}ms` }}
        >
          {/* Section Header */}
          <EditableSectionHeader
            section={section}
            isEditMode={isEditMode}
            onUpdate={(newTitle) => updateSectionTitle(section.id, newTitle)}
            onAddBlock={(type) => addBlock(section.id, type)}
          />

          {/* Content Blocks */}
          <div className="space-y-5 bg-gradient-to-br from-white to-slate-50 p-6 rounded-xl border border-slate-200/80 shadow-lg hover:shadow-xl transition-shadow duration-300">
            {section.blocks.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-500 text-sm font-medium">No content blocks added yet</p>
                <p className="text-slate-400 text-xs mt-1">Click "Add Block" to get started</p>
              </div>
            ) : (
              section.blocks.map((block) => renderBlock(block, section.id))
            )}
          </div>
        </div>
      ))}

      {/* Add Section Button */}
      {isEditMode && (
        <button
          onClick={addSection}
          className="w-full py-6 border-2 border-dashed border-slate-300 rounded-xl text-slate-600 hover:border-blue-400 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-300 flex items-center justify-center gap-3 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold">Add New Section</span>
          </div>
        </button>
      )}
    </div>
  )
}