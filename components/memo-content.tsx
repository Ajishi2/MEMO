"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Plus } from "lucide-react"
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
    <div className="bg-slate-900 text-white px-4 py-3 rounded-lg flex items-center justify-between gap-3">
      {isEditMode ? (
        <h2
          ref={headerRef}
          contentEditable
          suppressContentEditableWarning
          className="text-sm font-bold outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 rounded px-2 py-1 -mx-2 -my-1 min-w-[200px] flex-1"
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
        <h2 className="text-sm font-bold">{section.title}</h2>
      )}
      {isEditMode && (
        <div className="relative group flex-shrink-0">
          <button className="text-xs px-3 py-1.5 bg-white/20 rounded hover:bg-white/30 transition-colors flex items-center gap-1">
            <Plus className="w-3 h-3" />
            Add Block
          </button>
          <div className="absolute right-0 top-full mt-1 w-32 bg-white text-slate-900 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-10">
            {(["text", "chart", "table", "timeline", "bar-chart"] as const).map((type) => (
              <button
                key={type}
                onClick={() => onAddBlock(type)}
                className="w-full text-left px-3 py-2 text-xs hover:bg-slate-100 first:rounded-t-lg last:rounded-b-lg capitalize"
              >
                {type === "bar-chart" ? "Bar Chart" : type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const initialSections: Section[] = [
  {
    id: "1",
    title: "Problem Statement",
    blocks: [
      {
        id: "1-1",
        type: "text",
        data: {
          content:
            "Urban households face rising energy costs and unreliable power grids. Existing renewable energy solutions are expensive and lack efficiency in urban settings.",
        },
      },
    ],
  },
  {
    id: "2",
    title: "Section 1",
    blocks: [
      {
        id: "2-1",
        type: "text",
        data: {
          content:
            "GreenTech Solutions is a sustainability-focused company developing solar-powered energy storage solutions for urban households. Our mission is to make renewable energy affordable and accessible for all. We seek $2M in funding to scale production, expand marketing efforts, and increase our market presence.",
        },
      },
    ],
  },
]

interface MemoContentProps {
  isEditMode: boolean
}

export default function MemoContent({ isEditMode }: MemoContentProps) {
  const [sections, setSections] = useState(initialSections)
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null)

  const addSection = () => {
    const newSection = {
      id: `section-${Date.now()}`,
      title: `Section ${sections.length}`,
      blocks: [],
    }
    setSections([...sections, newSection])
  }

  const addBlock = (sectionId: string, type: BlockItem["type"]) => {
    setSections(
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
    setSections(
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
              setSections(
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
              setSections(
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
    setSections(
      sections.map((s) => (s.id === sectionId ? { ...s, title: newTitle } : s))
    )
  }

  return (
    <div className="bg-white p-8 space-y-8 min-h-screen">
      {sections.map((section) => (
        <div key={section.id} className="space-y-4">
          {/* Section Header */}
          <EditableSectionHeader
            section={section}
            isEditMode={isEditMode}
            onUpdate={(newTitle) => updateSectionTitle(section.id, newTitle)}
            onAddBlock={(type) => addBlock(section.id, type)}
          />

          {/* Content Blocks */}
          <div className="space-y-4 bg-slate-50 p-6 rounded-lg border border-slate-200">
            {section.blocks.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm">No content blocks added yet</div>
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
          className="w-full py-4 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Section
        </button>
      )}
    </div>
  )
}
