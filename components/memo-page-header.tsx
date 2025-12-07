"use client"

import { ChevronLeft } from "lucide-react"

interface MemoPageHeaderProps {
  title?: string
  subtitle?: string
  sidebarOpen?: boolean
  onToggleSidebar?: () => void
  userName?: string
  userRole?: string
  isEditMode?: boolean
  onModeToggle?: () => void
  onSaveDraft?: () => void
  isSaving?: boolean
}

export default function MemoPageHeader({
  title = "Company Profile",
  subtitle = "View or edit your company details",
  sidebarOpen,
  onToggleSidebar,
  userName = "Jake Doherty",
  userRole = "Team",
  isEditMode,
  onModeToggle,
  onSaveDraft,
  isSaving,
}: MemoPageHeaderProps) {
  return (
    <div className="bg-white border-b border-slate-200 px-8 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Left: Sidebar toggle and title */}
        <div className="flex items-center gap-6">
          <button
            onClick={onToggleSidebar}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600 hover:text-slate-900"
            title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            <ChevronLeft className={`w-6 h-6 transition-transform ${sidebarOpen ? "rotate-180" : ""}`} />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
            <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
          </div>
        </div>

        {/* Right: Action buttons and user info */}
        <div className="flex items-center gap-6">
          {/* Action Buttons */}
          <div className="flex gap-3">
            {isEditMode !== undefined && onSaveDraft && (
              <button 
                onClick={onSaveDraft}
                disabled={isSaving}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save To Drafts"}
              </button>
            )}
            {isEditMode !== undefined && onModeToggle ? (
              <button 
                onClick={onModeToggle}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium text-sm"
              >
                {isEditMode ? "Preview" : "Edit"}
              </button>
            ) : (
              <button className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium text-sm">
                Preview
              </button>
            )}
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm">
              Submit For Review
            </button>
          </div>

          {/* Divider */}
          <div className="h-8 w-px bg-slate-200"></div>

          {/* User Info */}
          <div className="flex items-center gap-3 cursor-pointer hover:opacity-75 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
              {userName.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">{userName}</p>
              <p className="text-xs text-slate-500">{userRole}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
