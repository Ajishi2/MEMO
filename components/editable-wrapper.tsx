"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { 
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Plus,
  Minus,
  Trash2,
  Edit2,
  Type,
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from "lucide-react"

interface EditableWrapperProps {
  id: string
  isEditMode: boolean
  onDelete: () => void
  onUpdate?: (data: any) => void
  isDragging?: boolean
  onDragStart?: (id: string) => void
  onDragEnd?: () => void
  children: React.ReactNode
}

interface SelectionState {
  selectedId: string | null
  toolbarPosition: { top: number; left: number }
}

let globalSelection: SelectionState = { selectedId: null, toolbarPosition: { top: 0, left: 0 } }
const globalSelectionListeners: Set<() => void> = new Set()

export function useEditorSelection() {
  const [selection, setSelection] = useState(globalSelection)

  useEffect(() => {
    const listener = () => {
      setSelection({ ...globalSelection })
    }
    globalSelectionListeners.add(listener)
    return () => {
      globalSelectionListeners.delete(listener)
    }
  }, [])

  const setSelected = (id: string | null, position?: { top: number; left: number }) => {
    globalSelection = { selectedId: id, toolbarPosition: position || { top: 0, left: 0 } }
    globalSelectionListeners.forEach((l) => l())
  }

  return { ...selection, setSelected }
}

export default function EditableWrapper({
  id,
  isEditMode,
  onDelete,
  onUpdate,
  isDragging,
  onDragStart,
  onDragEnd,
  children,
}: EditableWrapperProps) {
  const { selectedId, setSelected } = useEditorSelection()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const isSelected = isEditMode && selectedId === id

  const handleClick = (e: React.MouseEvent) => {
    if (!isEditMode) return
    e.stopPropagation()

    if (wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect()
      setSelected(id, {
        top: rect.top - 70,
        left: rect.left,
      })
    }
  }

  useEffect(() => {
    if (!isEditMode) return

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      // Don't deselect if clicking on the toolbar or its children
      const toolbar = document.querySelector('[data-editor-toolbar]')
      if (toolbar && (toolbar.contains(target) || toolbar === target)) {
        return
      }
      
      if (wrapperRef.current && !wrapperRef.current.contains(target)) {
        setSelected(null)
      }
    }

    // Use mousedown instead of click to prevent issues with select elements
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isEditMode, setSelected])

  useEffect(() => {
    if (!isSelected || !wrapperRef.current) return

    const updatePosition = () => {
      const rect = wrapperRef.current?.getBoundingClientRect()
      if (rect) {
        setSelected(id, {
          top: rect.top - 70,
          left: rect.left,
        })
      }
    }

    window.addEventListener("scroll", updatePosition)
    return () => window.removeEventListener("scroll", updatePosition)
  }, [isSelected, id, setSelected])

  return (
    <div
      ref={wrapperRef}
      onClick={handleClick}
      className={`relative transition-all ${
        isSelected ? "ring-2 ring-blue-500 ring-offset-1" : ""
      } ${isDragging ? "opacity-50" : ""} ${isEditMode ? "cursor-pointer" : ""}`}
      draggable={isEditMode}
      onDragStart={(e) => {
        e.stopPropagation()
        onDragStart?.(id)
      }}
      onDragEnd={(e) => {
        e.stopPropagation()
        onDragEnd?.()
      }}
    >
      {isSelected && <EditorToolbar onDelete={onDelete} wrapperRef={wrapperRef} />}
      {children}
    </div>
  )
}

interface EditorToolbarProps {
  onDelete: () => void
  wrapperRef: React.RefObject<HTMLDivElement | null>
}

const TEXT_COLORS = [
  "#000000",
  "#404040",
  "#606060",
  "#808080",
  "#A0A0A0",
  "#C0C0C0",
  "#E0E0E0",
  "#FFFFFF",
  "#FF0000",
  "#FF6B6B",
  "#FFA5A5",
  "#FFE5E5",
  "#FFA500",
  "#FFD580",
  "#FFF3CD",
  "#FFFF00",
  "#FFFFCC",
  "#00FF00",
  "#80FF80",
  "#E5FFE5",
  "#00FFFF",
  "#80FFFF",
  "#E5FFFF",
  "#0000FF",
  "#6B6BFF",
  "#A5A5FF",
  "#E5E5FF",
  "#800080",
  "#FF80FF",
  "#FFE5FF",
]

const HIGHLIGHT_COLORS = [
  "#FFFF00",
  "#FF6B6B",
  "#FFDAB9",
  "#FFD580",
  "#FFFF99",
  "#BFEF45",
  "#00FF00",
  "#80FF80",
  "#C6E0B4",
  "#80FFFF",
  "#B4D7F1",
  "#9DC3E6",
  "#B4C7E7",
  "#D5A6BD",
  "#FFE5FF",
  "#F4CCCC",
  "#F8CBAD",
  "#FCE5CD",
  "#FFF2CC",
  "#C9DAF8",
  "#CFE2F3",
  "#D9D2E9",
  "#EBD6F1",
  "#E2EFDA",
  "#FCE5CD",
  "#E2EFDA",
  "#DDEBF7",
  "#FFF2CC",
  "#DDEBF7",
  "#E2EFDA",
]

function EditorToolbar({ onDelete, wrapperRef }: EditorToolbarProps) {
  const [blockType, setBlockType] = useState("normal")
  const [fontFamily, setFontFamily] = useState("Inter")
  const [fontSize, setFontSize] = useState(16)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showHighlightPicker, setShowHighlightPicker] = useState(false)
  const [showLineSpacingMenu, setShowLineSpacingMenu] = useState(false)
  const [alignment, setAlignment] = useState("left")
  const savedSelectionRef = useRef<Range | null>(null)
  const colorPickerRef = useRef<HTMLDivElement>(null)
  const highlightPickerRef = useRef<HTMLDivElement>(null)
  const lineSpacingRef = useRef<HTMLDivElement>(null)

  const fontFamilies = ["Inter", "Georgia", "Times New Roman", "Courier New", "Verdana", "Arial"]

  // Save selection when toolbar is mounted or when contentEditable is focused
  useEffect(() => {
    const contentEditable = wrapperRef.current?.querySelector('[contenteditable="true"]') as HTMLElement
    if (!contentEditable) return

    const saveSelection = () => {
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        if (contentEditable.contains(range.commonAncestorContainer)) {
          savedSelectionRef.current = range.cloneRange()
        }
      }
    }

    // Save selection on various events
    contentEditable.addEventListener('mouseup', saveSelection)
    contentEditable.addEventListener('keyup', saveSelection)
    contentEditable.addEventListener('focus', saveSelection)

    return () => {
      contentEditable.removeEventListener('mouseup', saveSelection)
      contentEditable.removeEventListener('keyup', saveSelection)
      contentEditable.removeEventListener('focus', saveSelection)
    }
  }, [wrapperRef])

  // Find the contentEditable element within the wrapper
  const getContentEditable = (): HTMLElement | null => {
    if (!wrapperRef.current) return null
    const contentEditable = wrapperRef.current.querySelector('[contenteditable="true"]') as HTMLElement
    return contentEditable
  }

  // Get or create a selection within the contentEditable element
  const ensureSelection = (): boolean => {
    const contentEditable = getContentEditable()
    if (!contentEditable) return false

    // Focus first
    contentEditable.focus()

    const selection = window.getSelection()
    if (!selection) return false

    // First, try to restore saved selection
    if (savedSelectionRef.current) {
      try {
        selection.removeAllRanges()
        selection.addRange(savedSelectionRef.current)
        // Verify the selection is still valid
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0)
          if (contentEditable.contains(range.commonAncestorContainer)) {
            return true
          }
        }
      } catch (e) {
        // Selection is no longer valid, clear it
        savedSelectionRef.current = null
      }
    }

    // Check if we have a valid current selection within the contentEditable
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      // Check if the selection is within our contentEditable
      if (contentEditable.contains(range.commonAncestorContainer)) {
        // Save it for future use
        savedSelectionRef.current = range.cloneRange()
        return true
      }
    }

    // If no valid selection, create one at the cursor position or select all
    const range = document.createRange()
    
    // Try to find the last cursor position or create a collapsed range at the end
    if (contentEditable.childNodes.length > 0) {
      const lastNode = contentEditable.childNodes[contentEditable.childNodes.length - 1]
      if (lastNode.nodeType === Node.TEXT_NODE) {
        range.setStart(lastNode, lastNode.textContent?.length || 0)
        range.setEnd(lastNode, lastNode.textContent?.length || 0)
      } else {
        range.selectNodeContents(contentEditable)
      }
    } else {
      range.selectNodeContents(contentEditable)
    }

    selection.removeAllRanges()
    selection.addRange(range)
    savedSelectionRef.current = range.cloneRange()
    return true
  }

  const execCommand = (command: string, value?: string) => {
    const contentEditable = getContentEditable()
    if (!contentEditable) return

    // Ensure we have a valid selection
    if (!ensureSelection()) return

    // Small delay to ensure focus is set
    setTimeout(() => {
      // Execute the command
      const success = document.execCommand(command, false, value)
      
      if (!success) {
        console.warn(`Command ${command} failed`)
      }
      
      // Keep focus on contentEditable and update saved selection
      contentEditable.focus()
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        savedSelectionRef.current = selection.getRangeAt(0).cloneRange()
      }
    }, 0)
  }

  const toggleFormat = (command: string) => {
    const contentEditable = getContentEditable()
    if (!contentEditable) return

    // Use setTimeout to ensure selection is maintained
    setTimeout(() => {
      if (!ensureSelection()) return
      document.execCommand(command, false, undefined)
      contentEditable.focus()
      
      // Update saved selection
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        savedSelectionRef.current = selection.getRangeAt(0).cloneRange()
      }
    }, 10)
  }

  const handleAlignment = (align: string) => {
    const contentEditable = getContentEditable()
    if (!contentEditable) return

    setTimeout(() => {
      if (!ensureSelection()) return

    const alignMap: Record<string, string> = {
      left: "justifyLeft",
      center: "justifyCenter",
      right: "justifyRight",
      justify: "justifyFull",
    }
      
      // Try execCommand first
      const success = document.execCommand(alignMap[align], false, undefined)
      
      if (!success) {
        // Fallback: try to find the block element containing the selection
        const selection = window.getSelection()
        if (selection && selection.rangeCount > 0) {
          let node: Node | null = selection.getRangeAt(0).commonAncestorContainer
          
          // Find the block-level parent
          while (node && node !== contentEditable) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as HTMLElement
              const display = window.getComputedStyle(element).display
              if (display === 'block' || display === 'flex' || element.tagName === 'DIV' || element.tagName === 'P') {
                element.style.textAlign = align
                contentEditable.focus()
                return
              }
            }
            node = node.parentNode
          }
        }

        // Final fallback: apply to contentEditable itself
        contentEditable.style.textAlign = align
      }
      
      contentEditable.focus()
    }, 10)
  }

  const handleFontFamily = (family: string) => {
    setFontFamily(family)
    const contentEditable = getContentEditable()
    if (!contentEditable) return

    setTimeout(() => {
      if (!ensureSelection()) return
      document.execCommand("fontName", false, family)
      contentEditable.focus()
      
      // Update saved selection
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        savedSelectionRef.current = selection.getRangeAt(0).cloneRange()
      }
    }, 10)
  }

  const handleFontSize = (size: number) => {
    setFontSize(size)
    const contentEditable = getContentEditable()
    if (!contentEditable) return

    if (!ensureSelection()) return

    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return

      const range = selection.getRangeAt(0)
    
    // If selection is collapsed (just a cursor), apply to the parent element
    if (range.collapsed) {
      let node: Node | null = range.commonAncestorContainer
      while (node && node !== contentEditable) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as HTMLElement
          element.style.fontSize = `${size}px`
          contentEditable.focus()
          return
        }
        node = node.parentNode
      }
      // If no element found, apply to contentEditable
      contentEditable.style.fontSize = `${size}px`
      contentEditable.focus()
      return
    }

    // If there's a selection, wrap it in a span
    try {
      const span = document.createElement("span")
      span.style.fontSize = `${size}px`
        range.surroundContents(span)
      } catch (e) {
      // If surroundContents fails, try extracting and wrapping
      const contents = range.extractContents()
      const span = document.createElement("span")
      span.style.fontSize = `${size}px`
      span.appendChild(contents)
      range.insertNode(span)
    }
    
    contentEditable.focus()
  }

  const handleColorChange = (color: string) => {
    const contentEditable = getContentEditable()
    if (!contentEditable) return

    setTimeout(() => {
      if (!ensureSelection()) return
      document.execCommand("foreColor", false, color)
      contentEditable.focus()
    setShowColorPicker(false)
      
      // Update saved selection
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        savedSelectionRef.current = selection.getRangeAt(0).cloneRange()
      }
    }, 10)
  }

  const handleHighlightChange = (color: string) => {
    const contentEditable = getContentEditable()
    if (!contentEditable) return

    setTimeout(() => {
      if (!ensureSelection()) return
      document.execCommand("backColor", false, color)
      contentEditable.focus()
    setShowHighlightPicker(false)
      
      // Update saved selection
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        savedSelectionRef.current = selection.getRangeAt(0).cloneRange()
      }
    }, 10)
  }

  if (!wrapperRef.current) return null

  const rect = wrapperRef.current.getBoundingClientRect()
  const isOverflowing = rect.left + 1000 > window.innerWidth

  return (
    <div
      data-editor-toolbar
      className="absolute z-50 bg-white rounded-xl shadow-2xl border border-slate-200 p-2 flex flex-wrap gap-1 max-w-4xl overflow-x-auto"
      style={{
        top: `${-60}px`,
        left: isOverflowing ? "auto" : "0",
        right: isOverflowing ? "0" : "auto",
        maxWidth: "90vw",
      }}
      onMouseDown={(e) => {
        e.stopPropagation()
      }}
      onClick={(e) => {
        e.stopPropagation()
      }}
    >
      <button
        className="p-2 hover:bg-slate-100 rounded-lg transition flex items-center gap-1 text-sm"
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        Edit
      </button>

      <button
        className="p-2 hover:bg-red-50 rounded-lg transition text-red-600"
        onClick={(e) => {
          e.stopPropagation()
          onDelete()
        }}
      >
        <Trash2 className="w-4 h-4" />
      </button>

      <div className="w-px bg-slate-300 mx-1" />

      <select
        value="p"
        onChange={(e) => {
          e.preventDefault()
          e.stopPropagation()
          const contentEditable = getContentEditable()
          if (!contentEditable) return

          // Use setTimeout to ensure selection is maintained
          setTimeout(() => {
            if (!ensureSelection()) return

            const selection = window.getSelection()
            if (!selection || selection.rangeCount === 0) return

            const range = selection.getRangeAt(0)
            let node: Node | null = range.commonAncestorContainer

            // Find the block-level parent
            while (node && node !== contentEditable) {
              if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node as HTMLElement
                if (element.tagName === 'H1' || element.tagName === 'H2' || element.tagName === 'P' || element.tagName === 'DIV') {
                  // Replace the tag
                  const newTag = e.target.value === "h1" ? "H1" : e.target.value === "h2" ? "H2" : "P"
                  const newElement = document.createElement(newTag)
                  newElement.innerHTML = element.innerHTML
                  newElement.style.cssText = element.style.cssText
                  element.parentNode?.replaceChild(newElement, element)
                  contentEditable.focus()
                  return
                }
              }
              node = node.parentNode
            }

            // If no block found, use formatBlock command
            if (e.target.value === "h1") {
              document.execCommand("formatBlock", false, "<h1>")
            } else if (e.target.value === "h2") {
              document.execCommand("formatBlock", false, "<h2>")
            } else {
              document.execCommand("formatBlock", false, "<p>")
            }
            contentEditable.focus()
          }, 10)
        }}
        onMouseDown={(e) => {
          e.stopPropagation()
        }}
        onClick={(e) => {
          e.stopPropagation()
        }}
        className="px-3 py-1 text-sm border border-slate-300 rounded-lg hover:bg-slate-50"
      >
        <option value="p">Normal</option>
        <option value="h1">H1</option>
        <option value="h2">H2</option>
      </select>

      <select
        value={fontFamily}
        onChange={(e) => {
          e.preventDefault()
          e.stopPropagation()
          handleFontFamily(e.target.value)
        }}
        onMouseDown={(e) => {
          e.stopPropagation()
        }}
        onClick={(e) => {
          e.stopPropagation()
        }}
        className="px-3 py-1 text-sm border border-slate-300 rounded-lg hover:bg-slate-50"
      >
        {fontFamilies.map((font) => (
          <option key={font} value={font}>
            {font}
          </option>
        ))}
      </select>

      <button
        className="px-2 py-1 text-sm border border-slate-300 rounded-lg hover:bg-slate-50"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          handleFontSize(Math.max(12, fontSize - 2))
        }}
      >
        -
      </button>
      <input
        type="number"
        value={fontSize}
        onChange={(e) => {
          e.stopPropagation()
          handleFontSize(Math.max(12, Math.min(72, Number(e.target.value))))
        }}
        onClick={(e) => {
          e.stopPropagation()
        }}
        className="w-12 px-2 py-1 text-sm text-center border border-slate-300 rounded-lg"
      />
      <button
        className="px-2 py-1 text-sm border border-slate-300 rounded-lg hover:bg-slate-50"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          handleFontSize(Math.min(72, fontSize + 2))
        }}
      >
        +
      </button>

      <div className="w-px bg-slate-300 mx-1" />

      <button
        className="p-2 hover:bg-slate-100 rounded-lg transition font-bold"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          toggleFormat("bold")
        }}
        title="Bold"
      >
        B
      </button>

      <button
        className="p-2 hover:bg-slate-100 rounded-lg transition italic"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          toggleFormat("italic")
        }}
        title="Italic"
      >
        I
      </button>

      <button
        className="p-2 hover:bg-slate-100 rounded-lg transition underline"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          toggleFormat("underline")
        }}
        title="Underline"
      >
        U
      </button>

      <button
        className="p-2 hover:bg-slate-100 rounded-lg transition line-through"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          toggleFormat("strikethrough")
        }}
        title="Strikethrough"
      >
        S
      </button>

      <div className="w-px bg-slate-300 mx-1" />

      <div className="relative">
        <button
          className="p-2 hover:bg-slate-100 rounded-lg transition border border-slate-300"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setShowColorPicker(!showColorPicker)
          }}
          title="Text Color"
        >
          A
        </button>
        {showColorPicker && (
          <div className="absolute top-full mt-1 left-0 bg-white border border-slate-300 rounded-lg shadow-lg p-2 grid grid-cols-4 gap-2 z-50">
            {["#000000", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FFA500", "#DDA0DD", "#808080"].map((color) => (
              <button
                key={color}
                className="w-6 h-6 rounded border border-slate-300"
                style={{ backgroundColor: color }}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleColorChange(color)
                }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="relative">
        <button
          className="p-2 hover:bg-slate-100 rounded-lg transition border border-slate-300"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setShowHighlightPicker(!showHighlightPicker)
          }}
          title="Highlight Color"
        >
          ◼
        </button>
        {showHighlightPicker && (
          <div className="absolute top-full mt-1 left-0 bg-white border border-slate-300 rounded-lg shadow-lg p-2 grid grid-cols-4 gap-2 z-50">
            {["#FFFF00", "#FFA500", "#FFC0CB", "#90EE90", "#87CEEB", "#DDA0DD", "#F0F0F0"].map((color) => (
              <button
                key={color}
                className="w-6 h-6 rounded border border-slate-300"
                style={{ backgroundColor: color }}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleHighlightChange(color)
                }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="w-px bg-slate-300 mx-1" />

      <button
        className="p-2 hover:bg-slate-100 rounded-lg transition text-sm"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          handleAlignment("left")
        }}
        title="Align Left"
      >
        ⬅
      </button>

      <button
        className="p-2 hover:bg-slate-100 rounded-lg transition text-sm"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          handleAlignment("center")
        }}
        title="Align Center"
      >
        ⬍
      </button>

      <button
        className="p-2 hover:bg-slate-100 rounded-lg transition text-sm"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          handleAlignment("right")
        }}
        title="Align Right"
      >
        ➡
      </button>

      <button
        className="p-2 hover:bg-slate-100 rounded-lg transition text-sm"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          handleAlignment("justify")
        }}
        title="Justify"
      >
        ☰
      </button>
    </div>
  )
}

function Edit2({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
      />
    </svg>
  )
}
