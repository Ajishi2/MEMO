"use client"

import { useState, useCallback } from "react"

export interface EditorState {
  sections: any[]
}

export function useEditorHistory(initialState: EditorState) {
  const [history, setHistory] = useState<EditorState[]>([initialState])
  const [currentIndex, setCurrentIndex] = useState(0)

  const setState = useCallback(
    (newState: EditorState) => {
      const newHistory = history.slice(0, currentIndex + 1)
      newHistory.push(newState)
      setHistory(newHistory)
      setCurrentIndex(newHistory.length - 1)
    },
    [history, currentIndex],
  )

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }, [currentIndex])

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }, [currentIndex, history.length])

  return {
    currentState: history[currentIndex],
    setState,
    undo,
    redo,
    canUndo: currentIndex > 0,
    canRedo: currentIndex < history.length - 1,
  }
}
