"use client"

import { useState } from "react"
import { X } from "lucide-react"

interface ChartEditorModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => void
  initialData?: any
}

export default function ChartEditorModal({ isOpen, onClose, onSave, initialData }: ChartEditorModalProps) {
  const [chartData, setChartData] = useState(initialData || [])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h3 className="font-semibold">Edit Chart Data</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Chart data editing UI goes here */}
          <textarea
            value={JSON.stringify(chartData, null, 2)}
            onChange={(e) => setChartData(JSON.parse(e.target.value))}
            className="w-full h-48 p-3 border border-slate-300 rounded-lg font-mono text-sm"
          />
        </div>

        <div className="flex justify-end gap-2 p-4 border-t border-slate-200">
          <button onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition">
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(chartData)
              onClose()
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
