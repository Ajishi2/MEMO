"use client"

import { Button } from "@/components/ui/button"
import { Save, Eye, Send, Edit2, Loader } from "lucide-react"

interface TopBarProps {
  isEditMode: boolean
  onModeToggle: () => void
  onSaveDraft: () => void
  isSaving: boolean
}

export default function TopBar({ isEditMode, onModeToggle, onSaveDraft, isSaving }: TopBarProps) {
  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white px-8 py-5 flex items-center justify-between shadow-xl border-b border-slate-700/50">
      {/* Left - Memo Title */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
          Memo
        </h1>
        <p className="text-sm text-slate-400 font-medium">
          XYZ Corp • October 4, 2024 • Jane Doe, CEO
        </p>
      </div>

      {/* Right - Action Buttons */}
      <div className="flex items-center gap-3">
        {isEditMode && (
          <Button
            size="sm"
            onClick={onSaveDraft}
            disabled={isSaving}
            className="gap-2 bg-slate-700 text-white hover:bg-slate-600 border border-slate-600 shadow-lg transition-all duration-200 hover:shadow-slate-700/50"
          >
            {isSaving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? "Saving..." : "Save Draft"}
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={onModeToggle}
          className="gap-2 bg-white/10 text-white border-slate-600 hover:bg-white/20 hover:border-slate-500 backdrop-blur-sm shadow-lg transition-all duration-200"
        >
          {isEditMode ? (
            <>
              <Eye className="w-4 h-4" />
              Preview
            </>
          ) : (
            <>
              <Edit2 className="w-4 h-4" />
              Edit
            </>
          )}
        </Button>

        <Button 
          size="sm" 
          className="gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/30 transition-all duration-200 hover:shadow-blue-500/50 hover:scale-105"
        >
          <Send className="w-4 h-4" />
          Submit for review
        </Button>
      </div>
    </div>
  )
}