"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Plus, ChevronDown } from "lucide-react"
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
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    if (headerRef.current && !isInitialized) {
      headerRef.current.textContent = section.title
      setIsInitialized(true)
    }
  }, [section.title, isInitialized])

  return (
    <div className="mb-6 pt-4">
      <div className="relative bg-gradient-to-r from-blue-200/80 via-indigo-50/30 to-transparent rounded-lg px-2 py-1 -mx-2">
        <div className="flex items-center justify-between gap-4 pb-3">
        {isEditMode ? (
          <h2
            ref={headerRef}
            contentEditable
            suppressContentEditableWarning
            className="text-2xl font-bold text-slate-900 outline-none focus:text-indigo-600 transition-colors min-w-[200px] flex-1"
            onBlur={(e) => {
              const newTitle = e.currentTarget.textContent || section.title
              if (newTitle.trim() !== section.title) {
                onUpdate(newTitle.trim() || section.title)
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                e.currentTarget.blur()
              }
            }}
          />
        ) : (
          <h2 className="text-2xl font-bold text-slate-900">{section.title}</h2>
        )}
        {isEditMode && (
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Block
              <ChevronDown className={`w-3 h-3 transition-transform ${showDropdown ? "rotate-180" : ""}`} />
            </button>
            {showDropdown && (
              <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-lg shadow-lg border border-slate-200 z-10">
                {(["text", "chart", "table", "timeline", "bar-chart"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      onAddBlock(type)
                      setShowDropdown(false)
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors first:rounded-t-lg last:rounded-b-lg font-medium"
                  >
                    {type === "bar-chart" ? "Bar Chart" : type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        </div>
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
    onSectionsChange(sections.map((s) => (s.id === sectionId ? { ...s, title: newTitle } : s)))
  }

  return (
    <div className="p-8 md:p-12">
        <div className="max-w-4xl mx-auto">
          {sections.map((section) => (
            <div key={section.id} className="mb-12">
              <EditableSectionHeader
                section={section}
                isEditMode={isEditMode}
                onUpdate={(newTitle) => updateSectionTitle(section.id, newTitle)}
                onAddBlock={(type) => addBlock(section.id, type)}
              />

              {/* Content Blocks Container */}
              <div className="space-y-4">
                {section.blocks.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-slate-400 text-sm font-medium">No content blocks yet</p>
                    <p className="text-slate-300 text-xs mt-1">Click "Add Block" to get started</p>
                  </div>
                ) : (
                  <div className="space-y-6">{section.blocks.map((block) => renderBlock(block, section.id))}</div>
                )}
              </div>
            </div>
          ))}

          {/* Add Section Button */}
          {isEditMode && (
            <button
              onClick={addSection}
              className="w-full py-4 border-2 border-dashed border-indigo-200 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-all font-medium flex items-center justify-center gap-2 hover:border-indigo-300"
            >
              <Plus className="w-5 h-5" />
              Add Section
            </button>
          )}
        </div>
      </div>
    
  )
}
