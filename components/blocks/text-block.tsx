"use client"

import { useState, useRef, useEffect } from "react"
import EditableWrapper from "../editable-wrapper"

interface TextBlockProps {
  id: string
  isEditMode: boolean
  onDelete: () => void
  onUpdate?: (content: string) => void
  data?: { content: string }
}

export default function TextBlock({ id, isEditMode, onDelete, onUpdate, data }: TextBlockProps) {
  const [isDragging, setIsDragging] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize content from data prop only once
  useEffect(() => {
    if (contentRef.current && data?.content && !isInitialized) {
      contentRef.current.innerHTML = data.content
      setIsInitialized(true)
    } else if (contentRef.current && !data?.content && !isInitialized) {
      contentRef.current.innerHTML = "Click to edit text..."
      setIsInitialized(true)
    }
  }, [data?.content, isInitialized])

  const handleContentChange = () => {
    if (contentRef.current) {
      onUpdate?.(contentRef.current.innerHTML)
    }
  }

  return (
    <EditableWrapper
      id={id}
      isEditMode={isEditMode}
      onDelete={onDelete}
      onUpdate={handleContentChange}
      isDragging={isDragging}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
    >
      <div
        ref={contentRef}
        contentEditable={isEditMode}
        suppressContentEditableWarning
        onInput={handleContentChange}
        onBlur={handleContentChange}
        className={`p-6 rounded-lg border-2 bg-white transition-all min-h-20 ${
          isEditMode ? "border-dashed border-slate-300" : "border-slate-200"
        } ${isEditMode ? "focus:outline-none" : ""}`}
        dangerouslySetInnerHTML={undefined}
      />
    </EditableWrapper>
  )
}
