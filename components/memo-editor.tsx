"use client"

import { useState } from "react"
import Sidebar from "./sidebar"
import TopBar from "./top-bar"
import MemoContent from "./memo-content"
import LeftSidebar from "./left-sidebar"
import RightSidebar from "./right-sidebar"

interface MemoData {
  leftSidebar: {
    problemStatement: string
    solution: string
    marketOpportunity: string
    targetMarket: { value: string; amount: string }
    goal: { value: string; amount: string }
    fundingRequest: { amount: string }
  }
  rightSidebar: {
    highlights: string[]
  }
}

const initialMemoData: MemoData = {
  leftSidebar: {
    problemStatement: "Urban households face rising energy costs and unreliable power grids. Existing renewable energy solutions are expensive and lack efficiency in urban settings.",
    solution: "GreenTech Solutions provides compact, affordable, and high-efficiency solar energy storage units. Our SolarCube combines cutting-edge solar cells with AI-driven energy management.",
    marketOpportunity: "Category 1 vs Category 2",
    targetMarket: { value: "1,234", amount: "$100K" },
    goal: { value: "40%", amount: "$100K" },
    fundingRequest: { amount: "$2M" },
  },
  rightSidebar: {
    highlights: [
      "$1.5M in annual recurring revenue (ARR)",
      "30% year-over-year growth",
      "15 patents for proprietary solar technology",
      "Partnerships with 10+ utility companies",
    ],
  },
}

export default function MemoEditor() {
  const [isEditMode, setIsEditMode] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [memoData, setMemoData] = useState<MemoData>(initialMemoData)

  const handleSaveDraft = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      console.log("[v0] Draft saved successfully", memoData)
    }, 1000)
  }

  const updateLeftSidebar = (updates: Partial<MemoData["leftSidebar"]>) => {
    setMemoData((prev) => ({
      ...prev,
      leftSidebar: { ...prev.leftSidebar, ...updates },
    }))
  }

  const updateRightSidebar = (updates: Partial<MemoData["rightSidebar"]>) => {
    setMemoData((prev) => ({
      ...prev,
      rightSidebar: { ...prev.rightSidebar, ...updates },
    }))
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
            <LeftSidebar isEditMode={isEditMode} data={memoData.leftSidebar} onUpdate={updateLeftSidebar} />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-auto">
            <MemoContent isEditMode={isEditMode} />
          </div>

          {/* Right Sidebar - Highlights */}
          <div className="w-48 bg-slate-50 border-l border-slate-200 overflow-y-auto p-4">
            <RightSidebar isEditMode={isEditMode} data={memoData.rightSidebar} onUpdate={updateRightSidebar} />
          </div>
        </div>
      </div>
    </div>
  )
}
