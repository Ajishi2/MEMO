"use client"

import { useState } from "react"
import EditingToolbar from "../editing-toolbar"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface ChartBlockProps {
  isEditMode: boolean
  onDelete: () => void
}

const chartData = [
  { month: "Jan", revenue: 45000, expenses: 28000, sales: 52000 },
  { month: "Feb", revenue: 52000, expenses: 31000, sales: 58000 },
  { month: "Mar", revenue: 48000, expenses: 29000, sales: 55000 },
  { month: "Apr", revenue: 61000, expenses: 35000, sales: 65000 },
  { month: "May", revenue: 55000, expenses: 32000, sales: 60000 },
  { month: "Jun", revenue: 67000, expenses: 38000, sales: 72000 },
]

export default function ChartBlock({ isEditMode, onDelete }: ChartBlockProps) {
  const [showToolbar, setShowToolbar] = useState(false)

  return (
    <div className="group relative">
      <div
        className={`p-6 rounded-lg border-2 ${isEditMode ? "border-dashed border-slate-300" : "border-slate-200"} bg-white transition-all ${isEditMode && showToolbar ? "ring-2 ring-blue-400" : ""}`}
        onMouseEnter={() => isEditMode && setShowToolbar(true)}
        onMouseLeave={() => setShowToolbar(false)}
      >
        <div className="space-y-4">
          <div className="flex gap-4">
            <select className="text-sm border border-slate-300 rounded px-3 py-1">
              <option>Revenue</option>
              <option>Expenses</option>
              <option>Sales Volume</option>
            </select>
            <select className="text-sm border border-slate-300 rounded px-3 py-1">
              <option>Line Chart</option>
              <option>Bar Chart</option>
            </select>
            <select className="text-sm border border-slate-300 rounded px-3 py-1">
              <option>Last 6 months</option>
              <option>Last 3 months</option>
              <option>Last 12 months</option>
            </select>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {isEditMode && showToolbar && (
        <div className="absolute -top-12 left-0 z-50">
          <EditingToolbar onDelete={onDelete} />
        </div>
      )}
    </div>
  )
}
