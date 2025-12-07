"use client"

import { useState } from "react"
import Sidebar from "./sidebar"
import TopBar from "./memo-page-header"
import MemoContent from "./memo-content"
import LeftSidebar from "./left-sidebar"
import RightSidebar from "./right-sidebar"
import MemoHeader from "./header"
import { ArrowLeft } from "lucide-react"

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
  const [sections, setSections] = useState<Section[]>(initialSections)

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

  const handlePreviewToggle = () => {
    if (isEditMode) {
      setIsPreviewMode(true)
      setIsEditMode(false)
    } else {
      setIsPreviewMode(false)
      setIsEditMode(true)
    }
  }

  const handleBackFromPreview = () => {
    setIsPreviewMode(false)
    setIsEditMode(true)
  }

  // Preview mode: full screen memo with elegant back button
  if (isPreviewMode) {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col overflow-hidden">
        {/* Minimal elegant top bar */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white px-8 py-5 flex items-center justify-between shadow-xl border-b border-slate-700/50 flex-shrink-0">
          <button
            onClick={handleBackFromPreview}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Edit
          </button>
          
          <div className="space-y-1">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Preview Mode
            </h1>
            <p className="text-sm text-slate-400 font-medium">
              Full memo presentation view
            </p>
          </div>
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto">
          {/* Memo Header - spans all columns */}
          <div className="w-full px-8 py-6 bg-white border-b border-slate-200">
            <div className="max-w-full mx-auto">
              <MemoHeader memoTitle="Memo" company="XYZ Corp" date="October 4, 2024" author="Jane Doe, CEO" />
            </div>
          </div>

          {/* Full memo content with elegant spacing */}
          <div className="flex items-start">
            {/* Left Sidebar - Key Metrics */}
            <div className="w-72 border-r border-slate-200/80 flex-shrink-0">
              <LeftSidebar isEditMode={false} data={memoData.leftSidebar} onUpdate={updateLeftSidebar} />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 min-w-0">
              <div className="max-w-5xl mx-auto">
                <MemoContent isEditMode={false} sections={sections} onSectionsChange={setSections} />
              </div>
            </div>

            {/* Right Sidebar - Highlights */}
            <div className="w-72 border-l border-slate-200/80 flex-shrink-0">
              <RightSidebar isEditMode={false} data={memoData.rightSidebar} onUpdate={updateRightSidebar} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Normal mode: with sidebar and full top bar
  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Top Bar */}
        <TopBar
          isEditMode={isEditMode}
          onModeToggle={handlePreviewToggle}
          onSaveDraft={handleSaveDraft}
          isSaving={isSaving}
        />

        {/* Memo Header - spans all columns */}
        <div className="w-full px-8 py-6 bg-white border-b border-slate-200 flex-shrink-0">
          <div className="max-w-full mx-auto">
            <MemoHeader memoTitle="Memo" company="XYZ Corp" date="October 4, 2024" author="Jane Doe, CEO" />
          </div>
        </div>

        {/* Three-column layout with elegant borders and shadows */}
        <div className="flex items-start">
          {/* Left Sidebar - Key Metrics */}
          <div className="w-72 border-r border-slate-200/80 flex-shrink-0">
            <LeftSidebar isEditMode={isEditMode} data={memoData.leftSidebar} onUpdate={updateLeftSidebar} />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            <div className="max-w-5xl mx-auto">
              <MemoContent isEditMode={isEditMode} sections={sections} onSectionsChange={setSections} />
            </div>
          </div>

          {/* Right Sidebar - Highlights */}
          <div className="w-72 border-l border-slate-200/80 flex-shrink-0">
            <RightSidebar isEditMode={isEditMode} data={memoData.rightSidebar} onUpdate={updateRightSidebar} />
          </div>
        </div>
      </div>
    </div>
  )}