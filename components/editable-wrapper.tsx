"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import EditingToolbar from "./editing-toolbar"

interface EditableWrapperProps {
  id: string
  isEditMode: boolean
  onDelete: () => void
  onUpdate?: (data: any) => void
  isDragging?: boolean
  onDragStart?: (id: string) => void
  onDragEnd?: () => void
  hideSelectionRing?: boolean
  contentEditableRef?: React.RefObject<HTMLDivElement | null>
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
  hideSelectionRing = false,
  contentEditableRef: externalContentEditableRef,
  children,
}: EditableWrapperProps) {
  const { selectedId, setSelected } = useEditorSelection()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const internalContentEditableRef = useRef<HTMLDivElement>(null)
  const contentEditableRef = externalContentEditableRef || internalContentEditableRef
  const isSelected = isEditMode && selectedId === id
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 })

  // Update toolbar position when selection changes
  useEffect(() => {
    if (isSelected && wrapperRef.current) {
      // Use requestAnimationFrame to ensure DOM is updated before calculating position
      requestAnimationFrame(() => {
        if (wrapperRef.current) {
          const rect = wrapperRef.current.getBoundingClientRect()
          setToolbarPosition({
            top: rect.top - 80,
            left: rect.left,
          })
        }
      })
    }
  }, [isSelected])


  const handleClick = (e: React.MouseEvent) => {
    if (!isEditMode) return
    // Don't stop propagation here - let it bubble so clicks on children work

    if (wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect()
      setSelected(id, {
        top: rect.top - 70,
        left: rect.left,
      })
      setToolbarPosition({
        top: rect.top - 80,
        left: rect.left,
      })
    }
  }

  // Also handle clicks on the contentEditable element itself
  useEffect(() => {
    if (!isEditMode || !wrapperRef.current) return

    const handleContentClick = (e: MouseEvent) => {
      const target = e.target as Node
      // Check if click is on a contentEditable element within this wrapper
      if (wrapperRef.current?.contains(target)) {
        const contentEditable = (target as HTMLElement).closest('[contenteditable="true"]')
        if (contentEditable && wrapperRef.current.contains(contentEditable)) {
          const rect = wrapperRef.current.getBoundingClientRect()
          setSelected(id, {
            top: rect.top - 70,
            left: rect.left,
          })
          setToolbarPosition({
            top: rect.top - 80,
            left: rect.left,
          })
        }
      }
    }

    wrapperRef.current.addEventListener('click', handleContentClick, true) // Use capture phase
    return () => {
      wrapperRef.current?.removeEventListener('click', handleContentClick, true)
    }
  }, [isEditMode, id, setSelected])

  useEffect(() => {
    if (!isEditMode) return

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      const toolbar = document.querySelector("[data-editor-toolbar]")
      if (toolbar && (toolbar.contains(target) || toolbar === target)) {
        return
      }

      if (wrapperRef.current && !wrapperRef.current.contains(target)) {
        setSelected(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isEditMode, setSelected, id])

  // If using external ref, we don't need to find the element
  // The getContentEditable function in EditingToolbar will find it via querySelector

  return (
    <div
      ref={wrapperRef}
      className={`relative group transition-all ${isDragging ? "opacity-50" : ""} ${
        isSelected && !hideSelectionRing ? "ring-2 ring-blue-500 rounded-lg" : ""
      }`}
      onClick={handleClick}
      draggable={isEditMode}
      onDragStart={() => onDragStart?.(id)}
      onDragEnd={onDragEnd}
    >
      {isSelected && isEditMode && (
        <div
          className="fixed z-[9999] text-slate-900"
          data-editor-toolbar
          style={{
            top: `${toolbarPosition.top}px`,
            left: `${toolbarPosition.left}px`,
          }}
        >
          <EditingToolbar
            contentEditableRef={contentEditableRef}
            onDelete={onDelete}
            onCommand={(command, value) => {
              onUpdate?.({ command, value })
            }}
          />
        </div>
      )}

      {externalContentEditableRef ? (
        children
      ) : (
        <div ref={internalContentEditableRef}>
          {children}
          </div>
        )}
    </div>
  )
}
