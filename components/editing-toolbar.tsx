"use client"

import type React from "react"

import { useState, useCallback, useRef, useEffect } from "react"
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

interface EditingToolbarProps {
  onEdit?: () => void
  onDelete?: () => void
  onAddSection?: () => void
  onAddBlock?: () => void
  contentEditableRef: React.RefObject<HTMLDivElement>
  onCommand?: (command: string, value?: string) => void
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

export default function EditingToolbar({
  onEdit,
  onDelete,
  onAddSection,
  onAddBlock,
  contentEditableRef,
  onCommand,
}: EditingToolbarProps) {
  const [blockType, setBlockType] = useState("normal")
  const [fontFamily, setFontFamily] = useState("Inter")
  const [fontSize, setFontSize] = useState(16)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showHighlightPicker, setShowHighlightPicker] = useState(false)
  const [showLineSpacingMenu, setShowLineSpacingMenu] = useState(false)
  const [alignment, setAlignment] = useState("left")
  const colorPickerRef = useRef<HTMLDivElement>(null)
  const highlightPickerRef = useRef<HTMLDivElement>(null)
  const lineSpacingRef = useRef<HTMLDivElement>(null)

  const fontFamilies = ["Inter", "Georgia", "Times New Roman", "Courier New", "Verdana", "Arial"]

  // Execute command on contentEditable
  const execCommand = useCallback(
    (command: string, value?: string) => {
      if (!contentEditableRef.current) return

      const contentEditable = contentEditableRef.current
      contentEditable.focus()

      try {
        document.execCommand(command, false, value)
      } catch (e) {
        console.error(`Command ${command} failed:`, e)
      }

      onCommand?.(command, value)
    },
    [contentEditableRef, onCommand],
  )

  // Handle block type change (Normal, H1, H2)
  const handleBlockType = (type: string) => {
    setBlockType(type)
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return

    const range = selection.getRangeAt(0)
    const node: Node | null = range.commonAncestorContainer

    const findBlockElement = (n: Node | null): HTMLElement | null => {
      while (n && n !== contentEditableRef.current) {
        if (n.nodeType === Node.ELEMENT_NODE) {
          const element = n as HTMLElement
          if (["H1", "H2", "H3", "P", "DIV", "BLOCKQUOTE", "PRE"].includes(element.tagName)) {
            return element
          }
        }
        n = n.parentNode
      }
      return null
    }

    const blockElement = findBlockElement(node)
    if (blockElement) {
      let newElement: HTMLElement | null = null

      if (type === "h1") {
        newElement = document.createElement("h1")
        newElement.style.fontSize = "32px"
        newElement.style.fontWeight = "bold"
        newElement.style.marginTop = "0.67em"
        newElement.style.marginBottom = "0.67em"
      } else if (type === "h2") {
        newElement = document.createElement("h2")
        newElement.style.fontSize = "24px"
        newElement.style.fontWeight = "bold"
        newElement.style.marginTop = "0.75em"
        newElement.style.marginBottom = "0.75em"
      } else {
        newElement = document.createElement("p")
        newElement.style.fontSize = "16px"
      }

      newElement.innerHTML = blockElement.innerHTML
      newElement.style.cssText += blockElement.style.cssText
      blockElement.parentNode?.replaceChild(newElement, blockElement)
    }
  }

  // Handle font family change
  const handleFontFamily = (family: string) => {
    setFontFamily(family)
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return

    const range = selection.getRangeAt(0)

    if (!range.collapsed) {
      const span = document.createElement("span")
      span.style.fontFamily = family
      try {
        range.surroundContents(span)
      } catch (e) {
        const contents = range.extractContents()
        span.appendChild(contents)
        range.insertNode(span)
      }
    } else {
      execCommand("fontName", family)
    }
  }

  // Handle font size change
  const handleFontSize = (size: number) => {
    setFontSize(size)
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return

    const range = selection.getRangeAt(0)

    if (!range.collapsed) {
      const span = document.createElement("span")
      span.style.fontSize = `${size}px`
      try {
        range.surroundContents(span)
      } catch (e) {
        const contents = range.extractContents()
        span.appendChild(contents)
        range.insertNode(span)
      }
    }

    if (contentEditableRef.current) {
      contentEditableRef.current.focus()
    }
  }

  // Handle alignment cycling
  const handleAlignmentCycle = () => {
    const alignments = ["left", "center", "right", "justify"]
    const currentIndex = alignments.indexOf(alignment)
    const nextAlignment = alignments[(currentIndex + 1) % alignments.length]
    setAlignment(nextAlignment)

    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return

    const node: Node | null = selection.getRangeAt(0).commonAncestorContainer

    const findBlockElement = (n: Node | null): HTMLElement | null => {
      while (n && n !== contentEditableRef.current) {
        if (n.nodeType === Node.ELEMENT_NODE) {
          const element = n as HTMLElement
          const display = window.getComputedStyle(element).display
          if (display === "block" || element.tagName === "DIV" || element.tagName === "P") {
            return element
          }
        }
        n = n.parentNode
      }
      return contentEditableRef.current as HTMLElement
    }

    const blockElement = findBlockElement(node)
    if (blockElement) {
      blockElement.style.textAlign = nextAlignment
    }
  }

  // Handle line spacing
  const handleLineSpacing = (value: number) => {
    setShowLineSpacingMenu(false)
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return

    const node: Node | null = selection.getRangeAt(0).commonAncestorContainer

    const findBlockElement = (n: Node | null): HTMLElement | null => {
      while (n && n !== contentEditableRef.current) {
        if (n.nodeType === Node.ELEMENT_NODE) {
          const element = n as HTMLElement
          const display = window.getComputedStyle(element).display
          if (display === "block" || element.tagName === "DIV" || element.tagName === "P") {
            return element
          }
        }
        n = n.parentNode
      }
      return contentEditableRef.current as HTMLElement
    }

    const blockElement = findBlockElement(node)
    if (blockElement) {
      blockElement.style.lineHeight = String(value)
    }
  }

  // Handle text color
  const handleTextColor = (color: string) => {
    setShowColorPicker(false)
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return

    const range = selection.getRangeAt(0)

    if (!range.collapsed) {
      const span = document.createElement("span")
      span.style.color = color
      try {
        range.surroundContents(span)
      } catch (e) {
        const contents = range.extractContents()
        span.appendChild(contents)
        range.insertNode(span)
      }
    } else {
      execCommand("foreColor", color)
    }
  }

  // Handle highlight color
  const handleHighlightColor = (color: string) => {
    setShowHighlightPicker(false)
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return

    const range = selection.getRangeAt(0)

    if (!range.collapsed) {
      const span = document.createElement("span")
      span.style.backgroundColor = color
      try {
        range.surroundContents(span)
      } catch (e) {
        const contents = range.extractContents()
        span.appendChild(contents)
        range.insertNode(span)
      }
    } else {
      execCommand("backColor", color)
    }
  }

  // Close pickers on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(e.target as Node)) {
        setShowColorPicker(false)
      }
      if (highlightPickerRef.current && !highlightPickerRef.current.contains(e.target as Node)) {
        setShowHighlightPicker(false)
      }
      if (lineSpacingRef.current && !lineSpacingRef.current.contains(e.target as Node)) {
        setShowLineSpacingMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const buttonClass =
    "h-8 w-8 flex items-center justify-center rounded-md hover:bg-slate-100 transition active:bg-slate-200 cursor-pointer flex-shrink-0"
  const selectClass =
    "h-8 px-2 rounded-md border border-slate-300 text-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer flex-shrink-0"

  return (
    <div className="flex flex-wrap gap-1 p-3 bg-white rounded-xl shadow-2xl border border-slate-200 max-w-full pointer-events-auto">
      {/* Edit & Delete */}
      {onEdit && (
        <button className={buttonClass} onClick={onEdit} title="Edit" onMouseDown={(e) => e.preventDefault()}>
          <Edit2 className="w-4 h-4 text-slate-700" />
        </button>
      )}

      {onDelete && (
        <button
          className={`${buttonClass} text-red-600 hover:bg-red-50`}
          onClick={onDelete}
          title="Delete"
          onMouseDown={(e) => e.preventDefault()}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}

      {/* Separator */}
      {(onEdit || onDelete) && <div className="w-px h-6 bg-slate-300 mx-0.5" />}

      {/* Heading selector */}
      <select value={blockType} onChange={(e) => handleBlockType(e.target.value)} className={selectClass}>
        <option value="normal">Normal</option>
        <option value="h1">H1</option>
        <option value="h2">H2</option>
      </select>

      {/* Font family selector */}
      <select value={fontFamily} onChange={(e) => handleFontFamily(e.target.value)} className={selectClass}>
        {fontFamilies.map((font) => (
          <option key={font} value={font}>
            {font}
          </option>
        ))}
      </select>

      {/* Font size controls */}
      <button
        className={buttonClass}
        onClick={() => handleFontSize(Math.max(12, fontSize - 1))}
        title="Decrease font size"
        onMouseDown={(e) => e.preventDefault()}
      >
        <Minus className="w-4 h-4" />
      </button>

      <input
        type="number"
        value={fontSize}
        onChange={(e) => handleFontSize(Math.max(12, Math.min(72, Number(e.target.value))))}
        className="h-8 w-12 px-2 text-sm text-center border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex-shrink-0"
        min="12"
        max="72"
        onMouseDown={(e) => e.preventDefault()}
      />

      <button
        className={buttonClass}
        onClick={() => handleFontSize(Math.min(72, fontSize + 1))}
        title="Increase font size"
        onMouseDown={(e) => e.preventDefault()}
      >
        <Plus className="w-4 h-4" />
      </button>

      {/* Separator */}
      <div className="w-px h-6 bg-slate-300 mx-0.5" />

      {/* Text formatting buttons */}
      <button
        className={buttonClass}
        onClick={() => execCommand("bold")}
        title="Bold (Ctrl+B)"
        onMouseDown={(e) => e.preventDefault()}
      >
            <Bold className="w-4 h-4" />
          </button>

      <button
        className={buttonClass}
        onClick={() => execCommand("italic")}
        title="Italic (Ctrl+I)"
        onMouseDown={(e) => e.preventDefault()}
      >
            <Italic className="w-4 h-4" />
          </button>

      <button
        className={buttonClass}
        onClick={() => execCommand("underline")}
        title="Underline (Ctrl+U)"
        onMouseDown={(e) => e.preventDefault()}
      >
            <Underline className="w-4 h-4" />
          </button>

      <button
        className={buttonClass}
        onClick={() => execCommand("strikeThrough")}
        title="Strikethrough"
        onMouseDown={(e) => e.preventDefault()}
      >
            <Strikethrough className="w-4 h-4" />
          </button>

      {/* Separator */}
      <div className="w-px h-6 bg-slate-300 mx-0.5" />

      {/* Text color picker */}
      <div className="relative" ref={colorPickerRef}>
        <button
          className={buttonClass}
          onClick={() => setShowColorPicker(!showColorPicker)}
          title="Text color"
          onMouseDown={(e) => e.preventDefault()}
        >
          <Type className="w-4 h-4" />
        </button>
        {showColorPicker && (
          <div className="absolute top-full mt-2 left-0 bg-white border border-slate-300 rounded-lg shadow-2xl p-3 z-50 grid grid-cols-5 gap-2">
            {TEXT_COLORS.map((color) => (
              <button
                key={color}
                className="w-6 h-6 rounded border border-slate-300 hover:scale-110 transition hover:shadow-md flex-shrink-0"
                style={{ backgroundColor: color }}
                onClick={() => handleTextColor(color)}
                onMouseDown={(e) => e.preventDefault()}
                title={color}
              />
            ))}
          </div>
        )}
      </div>

      {/* Highlight color picker */}
      <div className="relative" ref={highlightPickerRef}>
        <button
          className={buttonClass}
          onClick={() => setShowHighlightPicker(!showHighlightPicker)}
          title="Highlight color"
          onMouseDown={(e) => e.preventDefault()}
        >
          <Highlighter className="w-4 h-4" />
          </button>
        {showHighlightPicker && (
          <div className="absolute top-full mt-2 left-0 bg-white border border-slate-300 rounded-lg shadow-2xl p-3 z-50 grid grid-cols-5 gap-2">
            {HIGHLIGHT_COLORS.map((color) => (
              <button
                key={color}
                className="w-6 h-6 rounded border border-slate-300 hover:scale-110 transition hover:shadow-md flex-shrink-0"
                style={{ backgroundColor: color }}
                onClick={() => handleHighlightColor(color)}
                onMouseDown={(e) => e.preventDefault()}
                title={color}
              />
            ))}
          </div>
        )}
      </div>

      {/* Separator */}
      <div className="w-px h-6 bg-slate-300 mx-0.5" />

      {/* Alignment button (cycles through left, center, right, justify) */}
      <button
        className={buttonClass}
        onClick={handleAlignmentCycle}
        title={`Align ${alignment} (click to cycle)`}
        onMouseDown={(e) => e.preventDefault()}
      >
        {alignment === "left" && <AlignLeft className="w-4 h-4" />}
        {alignment === "center" && <AlignCenter className="w-4 h-4" />}
        {alignment === "right" && <AlignRight className="w-4 h-4" />}
        {alignment === "justify" && <AlignJustify className="w-4 h-4" />}
          </button>

      {/* Line spacing menu */}
      <div className="relative" ref={lineSpacingRef}>
        <button
          className={buttonClass}
          onClick={() => setShowLineSpacingMenu(!showLineSpacingMenu)}
          title="Line spacing"
          onMouseDown={(e) => e.preventDefault()}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <line x1="4" y1="6" x2="20" y2="6" stroke="currentColor" strokeWidth="2" />
            <line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="2" />
            <line x1="4" y1="18" x2="20" y2="18" stroke="currentColor" strokeWidth="2" />
          </svg>
          </button>
        {showLineSpacingMenu && (
          <div className="absolute top-full mt-1 left-0 bg-white border border-slate-300 rounded-lg shadow-lg p-1 z-50 whitespace-nowrap">
            {[
              { label: "1.0", value: 1 },
              { label: "1.15", value: 1.15 },
              { label: "1.5", value: 1.5 },
              { label: "2.0", value: 2 },
            ].map((option) => (
              <button
                key={option.value}
                className="block w-full text-left px-3 py-2 hover:bg-slate-100 transition text-sm"
                onClick={() => handleLineSpacing(option.value)}
                onMouseDown={(e) => e.preventDefault()}
              >
                {option.label}
          </button>
            ))}
          </div>
        )}
      </div>

      {/* Separator */}
      {(onAddSection || onAddBlock) && <div className="w-px h-6 bg-slate-300 mx-0.5" />}

      {/* Add section/block buttons */}
          {onAddSection && (
        <button
          className={buttonClass}
          onClick={onAddSection}
          title="Add section"
          onMouseDown={(e) => e.preventDefault()}
        >
              <Plus className="w-4 h-4" />
            </button>
          )}

          {onAddBlock && (
        <button
          className={`${buttonClass} border border-slate-300`}
          onClick={onAddBlock}
          title="Add block"
          onMouseDown={(e) => e.preventDefault()}
        >
              <Plus className="w-4 h-4" />
            </button>
      )}
    </div>
  )
}
