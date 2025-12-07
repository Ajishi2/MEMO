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
    <div className="bg-gradient-to-r from-purple-900 to-purple-800 text-white px-8 py-6 flex items-center justify-between border-b-4 border-white">
      {/* Left - Memo Title */}
      <div>
        <h1 className="text-2xl font-bold">Memo</h1>
        <p className="text-sm text-purple-100">(XYZ Corp | October 4, 2024 | Jane Doe, CEO)</p>
      </div>

      {/* Right - Action Buttons */}
      <div className="flex items-center gap-3">
        {isEditMode && (
          <Button
            size="sm"
            onClick={onSaveDraft}
            disabled={isSaving}
            className="gap-2 bg-white text-purple-900 hover:bg-purple-50"
          >
            {isSaving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? "Saving..." : "Save Draft"}
          </Button>
        )}

        <Button
          variant={isEditMode ? "outline" : "default"}
          size="sm"
          onClick={onModeToggle}
          className={`gap-2 ${isEditMode ? "bg-white text-purple-900" : "bg-white text-purple-900"}`}
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

        <Button size="sm" className="gap-2 bg-white text-purple-900 hover:bg-purple-50">
          <Send className="w-4 h-4" />
          Submit
        </Button>
      </div>
    </div>
  )
}
