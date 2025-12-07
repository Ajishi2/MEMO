
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
  contentEditableRef: React.RefObject<HTMLDivElement | null>
  onCommand?: (command: string, value?: string) => void
}

// Theme Colors - MS Word style (10 colors)
const THEME_COLORS = [
  "#FFFFFF", // White
  "#000000", // Black
  "#E7E6E6", // Light Gray
  "#44546A", // Dark Blue
  "#4472C4", // Blue
  "#ED7D31", // Orange
  "#A5A5A5", // Gray
  "#FFC000", // Yellow
  "#5B9BD5", // Light Blue
  "#70AD47", // Green
]

// Theme Color Tints - arranged in columns (5 tints per color)
const THEME_TINTS = [
  // Column 1: White tints
  ["#FFFFFF", "#F2F2F2", "#D9D9D9", "#BFBFBF", "#A6A6A6"],
  // Column 2: Black tints
  ["#000000", "#7F7F7F", "#595959", "#3F3F3F", "#262626"],
  // Column 3: Light Gray tints
  ["#E7E6E6", "#D0CECE", "#AEABAB", "#757171", "#3A3838"],
  // Column 4: Dark Blue tints
  ["#44546A", "#D6DCE5", "#ADBACA", "#8497B0", "#323E4F"],
  // Column 5: Blue tints
  ["#4472C4", "#D9E2F3", "#B4C7E7", "#8EAADB", "#2F5597"],
  // Column 6: Orange tints
  ["#ED7D31", "#FCE5D4", "#F8CBAD", "#F4B183", "#C65911"],
  // Column 7: Gray tints
  ["#A5A5A5", "#EDEDED", "#DBDBDB", "#C9C9C9", "#7B7B7B"],
  // Column 8: Yellow tints
  ["#FFC000", "#FFF2CC", "#FFE699", "#FFD966", "#BF9000"],
  // Column 9: Light Blue tints
  ["#5B9BD5", "#DDEBF7", "#BDD7EE", "#9BC2E6", "#2E75B6"],
  // Column 10: Green tints
  ["#70AD47", "#E2EFDA", "#C5E0B4", "#A8D08D", "#548235"],
]

// Standard Colors - MS Word style (10 colors in a row)
const STANDARD_COLORS = [
  "#C00000", // Dark Red
  "#FF0000", // Red
  "#FFC000", // Orange
  "#FFFF00", // Yellow
  "#92D050", // Light Green
  "#00B050", // Green
  "#00B0F0", // Light Blue
  "#0070C0", // Blue
  "#002060", // Dark Blue
  "#7030A0", // Purple
]

// Highlight Colors - MS Word style (common highlight colors)
const HIGHLIGHT_COLORS = [
  "#FFFF00", // Yellow
  "#00FF00", // Bright Green
  "#00FFFF", // Cyan
  "#FF00FF", // Magenta
  "#0000FF", // Blue
  "#FF0000", // Red
  "#00008B", // Dark Blue
  "#008B8B", // Dark Cyan
  "#006400", // Dark Green
  "#800080", // Purple
  "#8B0000", // Dark Red
  "#FF8C00", // Dark Orange
  "#FFD700", // Gold
  "#808080", // Gray
  "#C0C0C0", // Silver
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
  const [recentColors, setRecentColors] = useState<string[]>([])
  const colorPickerRef = useRef<HTMLDivElement>(null)
  const highlightPickerRef = useRef<HTMLDivElement>(null)
  const lineSpacingRef = useRef<HTMLDivElement>(null)

  const fontFamilies = ["Inter", "Georgia", "Times New Roman", "Courier New", "Verdana", "Arial"]

  // Get the actual contentEditable element
  const getContentEditable = useCallback((): HTMLElement | null => {
    if (!contentEditableRef.current) return null
    // If the ref itself is contentEditable, return it
    if (contentEditableRef.current.hasAttribute('contenteditable')) {
      return contentEditableRef.current
    }
    // Otherwise, find the contentEditable element within the ref
    return contentEditableRef.current.querySelector('[contenteditable="true"]') as HTMLElement
  }, [contentEditableRef])

  // Execute command on contentEditable
  const execCommand = useCallback(
    (command: string, value?: string) => {
      const contentEditable = getContentEditable()
      if (!contentEditable) return

      contentEditable.focus()

      try {
        document.execCommand(command, false, value)
      } catch (e) {
        console.error(`Command ${command} failed:`, e)
      }

      onCommand?.(command, value)
    },
    [getContentEditable, onCommand],
  )

  // Handle block type change (Normal, H1, H2)
  const handleBlockType = (type: string) => {
    setBlockType(type)
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return

    const range = selection.getRangeAt(0)
    const node: Node | null = range.commonAncestorContainer

    const contentEditable = getContentEditable()
    const container = contentEditableRef.current
    
    const findBlockElement = (n: Node | null): HTMLElement | null => {
      while (n && container && !container.contains(n)) {
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

    const contentEditable = getContentEditable()
    if (contentEditable) {
      contentEditable.focus()
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

    const contentEditable = getContentEditable()
    const container = contentEditableRef.current
    
    const findBlockElement = (n: Node | null): HTMLElement | null => {
      while (n && container && !container.contains(n)) {
        if (n.nodeType === Node.ELEMENT_NODE) {
          const element = n as HTMLElement
          const display = window.getComputedStyle(element).display
          if (display === "block" || element.tagName === "DIV" || element.tagName === "P") {
            return element
          }
        }
        n = n.parentNode
      }
      return contentEditable
    }

    const blockElement = findBlockElement(node)
    if (blockElement) {
      blockElement.style.textAlign = nextAlignment
      if (contentEditable) {
        contentEditable.focus()
      }
    }
  }

  // Handle line spacing
  const handleLineSpacing = (value: number) => {
    setShowLineSpacingMenu(false)
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return

    const node: Node | null = selection.getRangeAt(0).commonAncestorContainer

    const contentEditable = getContentEditable()
    const container = contentEditableRef.current
    
    const findBlockElement = (n: Node | null): HTMLElement | null => {
      while (n && container && !container.contains(n)) {
        if (n.nodeType === Node.ELEMENT_NODE) {
          const element = n as HTMLElement
          const display = window.getComputedStyle(element).display
          if (display === "block" || element.tagName === "DIV" || element.tagName === "P") {
            return element
          }
        }
        n = n.parentNode
      }
      return contentEditable
    }

    const blockElement = findBlockElement(node)
    if (blockElement) {
      blockElement.style.lineHeight = String(value)
      if (contentEditable) {
        contentEditable.focus()
      }
    }
  }

  // Handle text color
  const handleTextColor = (color: string) => {
    setShowColorPicker(false)
    
    // Add to recent colors (max 10)
    if (color !== "transparent") {
      setRecentColors(prev => {
        const filtered = prev.filter(c => c !== color)
        return [color, ...filtered].slice(0, 10)
      })
    }
    
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return

    const range = selection.getRangeAt(0)

    if (!range.collapsed) {
      const span = document.createElement("span")
      if (color === "transparent") {
        span.style.color = ""
      } else {
        span.style.color = color
      }
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
      if (color === "transparent") {
        span.style.backgroundColor = ""
      } else {
        span.style.backgroundColor = color
      }
      try {
        range.surroundContents(span)
      } catch (e) {
        const contents = range.extractContents()
        span.appendChild(contents)
        range.insertNode(span)
      }
    } else {
      if (color === "transparent") {
        execCommand("backColor", "transparent")
      } else {
        execCommand("backColor", color)
      }
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
          <div className="absolute top-full mt-2 left-0 bg-white border border-slate-300 rounded-lg shadow-2xl p-3 z-50 w-72">
            {/* Recent Colors */}
            {recentColors.length > 0 && (
              <div className="mb-3">
                <p className="text-xs font-medium text-slate-600 mb-2">Recent Colors</p>
                <div className="flex gap-1">
                  {recentColors.map((color, idx) => (
                    <button
                      key={`recent-${idx}`}
                      className="w-5 h-5 rounded border border-slate-300 hover:scale-110 transition hover:shadow-md flex-shrink-0"
                      style={{ backgroundColor: color }}
                      onClick={() => handleTextColor(color)}
                      onMouseDown={(e) => e.preventDefault()}
                      title={color}
                    />
                  ))}
                </div>
                <div className="h-px bg-slate-200 my-3" />
              </div>
            )}

            {/* Theme Colors */}
            <div className="mb-3">
              <p className="text-xs font-medium text-slate-600 mb-2">Theme Colors</p>
              <div className="flex gap-1">
                {THEME_COLORS.map((color) => (
                  <button
                    key={color}
                    className="w-5 h-5 rounded border border-slate-300 hover:scale-110 transition hover:shadow-md flex-shrink-0"
                    style={{ backgroundColor: color }}
                    onClick={() => handleTextColor(color)}
                    onMouseDown={(e) => e.preventDefault()}
                    title={color}
                  />
                ))}
              </div>
              {/* Theme Tints - vertical columns */}
              <div className="flex gap-1 mt-1">
                {THEME_TINTS.map((tintColumn, colIdx) => (
                  <div key={colIdx} className="flex flex-col gap-1">
                    {tintColumn.map((color, rowIdx) => (
                      <button
                        key={`${colIdx}-${rowIdx}`}
                        className="w-5 h-5 rounded border border-slate-200 hover:scale-110 transition hover:shadow-md flex-shrink-0"
                        style={{ backgroundColor: color }}
                        onClick={() => handleTextColor(color)}
                        onMouseDown={(e) => e.preventDefault()}
                        title={color}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Separator */}
            <div className="h-px bg-slate-200 my-3" />

            {/* Standard Colors */}
            <div className="mb-3">
              <p className="text-xs font-medium text-slate-600 mb-2">Standard Colors</p>
              <div className="flex gap-1">
                {STANDARD_COLORS.map((color) => (
                  <button
                    key={color}
                    className="w-5 h-5 rounded border border-slate-300 hover:scale-110 transition hover:shadow-md flex-shrink-0"
                    style={{ backgroundColor: color }}
                    onClick={() => handleTextColor(color)}
                    onMouseDown={(e) => e.preventDefault()}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Separator */}
            <div className="h-px bg-slate-200 my-3" />

            {/* No Color option */}
            <button
              className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded transition text-sm mb-2"
              onClick={() => handleTextColor("transparent")}
              onMouseDown={(e) => e.preventDefault()}
            >
              <div className="w-5 h-5 border border-slate-400 rounded-sm relative bg-white">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-0.5 bg-red-500 rotate-45 origin-center" />
                </div>
              </div>
              <span className="text-slate-700 text-sm">No Color</span>
            </button>

            {/* More Colors */}
            <button
              className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded transition text-sm"
              onMouseDown={(e) => e.preventDefault()}
            >
              <div className="w-5 h-5 bg-gradient-to-br from-red-500 via-yellow-500 to-blue-500 rounded-sm border border-slate-300" />
              <span className="text-slate-700 text-sm">More Colors...</span>
            </button>
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
          <div className="absolute top-full mt-2 left-0 bg-white border border-slate-300 rounded-lg shadow-2xl p-3 z-50 w-72">
            {/* No Color option */}
            <button
              className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded transition text-sm mb-3"
              onClick={() => handleHighlightColor("transparent")}
              onMouseDown={(e) => e.preventDefault()}
            >
              <div className="w-5 h-5 border border-slate-400 rounded-sm relative bg-white">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-0.5 bg-red-500 rotate-45 origin-center" />
                </div>
              </div>
              <span className="text-slate-700 text-sm">No Color</span>
            </button>

            {/* Separator */}
            <div className="h-px bg-slate-200 mb-3" />

            {/* Highlight Colors Grid */}
            <div className="grid grid-cols-5 gap-1.5">
              {HIGHLIGHT_COLORS.map((color) => (
                <button
                  key={color}
                  className="w-10 h-7 rounded border border-slate-300 hover:scale-105 transition hover:shadow-md"
                  style={{ backgroundColor: color }}
                  onClick={() => handleHighlightColor(color)}
                  onMouseDown={(e) => e.preventDefault()}
                  title={color}
                />
              ))}
            </div>

            {/* Separator */}
            <div className="h-px bg-slate-200 my-3" />

            {/* More Colors */}
            <button
              className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded transition text-sm"
              onMouseDown={(e) => e.preventDefault()}
            >
              <div className="w-5 h-5 bg-gradient-to-br from-red-500 via-yellow-500 to-blue-500 rounded-sm border border-slate-300" />
              <span className="text-slate-700 text-sm">More Colors...</span>
            </button>
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
