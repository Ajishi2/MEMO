"use client"

import { useState } from "react"
import Sidebar from "./sidebar"
import TopBar from "./top-bar"
import MemoContent from "./memo-content"
import LeftSidebar from "./left-sidebar"
import RightSidebar from "./right-sidebar"

export default function MemoEditor() {
  const [isEditMode, setIsEditMode] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSaveDraft = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      console.log("[v0] Draft saved successfully")
    }, 1000)
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Bar */}
        <TopBar
          isEditMode={isEditMode}
          onModeToggle={() => setIsEditMode(!isEditMode)}
          onSaveDraft={handleSaveDraft}
          isSaving={isSaving}
        />

        {/* Three-column layout: Left sidebar | Main content | Right sidebar */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar - Key Metrics */}
          <div className="w-56 bg-white border-r border-slate-200 overflow-y-auto">
            <LeftSidebar />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-auto">
            <MemoContent isEditMode={isEditMode} />
          </div>

          {/* Right Sidebar - Highlights */}
          <div className="w-48 bg-slate-50 border-l border-slate-200 overflow-y-auto p-4">
            <RightSidebar />
          </div>
        </div>
      </div>
    </div>
  )
}
