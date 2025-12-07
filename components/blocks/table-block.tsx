"use client"

import { useState } from "react"
import EditableWrapper from "../editable-wrapper"
import { Plus, Trash2 } from "lucide-react"

interface TableBlockProps {
  id: string
  isEditMode: boolean
  onDelete: () => void
  onUpdate?: (data: string[][]) => void
  data?: string[][]
}

export default function TableBlock({ id, isEditMode, onDelete, onUpdate, data }: TableBlockProps) {
  const defaultData = [
    ["Metric", "Q1", "Q2", "Q3"],
    ["Revenue", "$45M", "$52M", "$61M"],
    ["Growth", "12%", "15%", "18%"],
    ["Margin", "28%", "31%", "34%"],
  ]

  const [tableData, setTableData] = useState<string[][]>(Array.isArray(data) && data.length > 0 ? data : defaultData)
  const [isDragging, setIsDragging] = useState(false)

  const handleCellUpdate = (row: number, col: number, value: string) => {
    const newData = [...tableData]
    newData[row][col] = value
    setTableData(newData)
    onUpdate?.(newData)
  }

  const addRow = () => {
    if (tableData.length === 0) return
    const newRow = new Array(tableData[0].length).fill("Edit me")
    const newData = [...tableData, newRow]
    setTableData(newData)
    onUpdate?.(newData)
  }

  const removeRow = (row: number) => {
    const newData = tableData.filter((_, i) => i !== row)
    setTableData(newData)
    onUpdate?.(newData)
  }

  const addColumn = () => {
    if (tableData.length === 0) return
    const newData = tableData.map((row) => [...row, "Edit me"])
    setTableData(newData)
    onUpdate?.(newData)
  }

  const removeColumn = (col: number) => {
    const newData = tableData.map((row) => row.filter((_, c) => c !== col))
    setTableData(newData)
    onUpdate?.(newData)
  }

  return (
    <div
      className={`p-6 rounded-lg border-2 bg-white transition-all ${
        isEditMode ? "border-dashed border-slate-300" : "border-slate-200"
      } overflow-x-auto`}
    >
      <table className="w-full border-collapse">
        <tbody>
          {tableData &&
            Array.isArray(tableData) &&
            tableData.map((row, rowIdx) => (
              <tr key={rowIdx} className={rowIdx % 2 === 0 ? "bg-slate-50" : "bg-white"}>
                {row.map((cell, colIdx) => (
                  <td key={`${rowIdx}-${colIdx}`} className="border border-slate-200 p-0">
                    <EditableWrapper
                      id={`cell-${rowIdx}-${colIdx}`}
                      isEditMode={isEditMode}
                      onDelete={() => removeRow(rowIdx)}
                      onUpdate={(data) => handleCellUpdate(rowIdx, colIdx, data?.textContent || cell)}
                    >
                      <div
                        contentEditable={isEditMode}
                        suppressContentEditableWarning
                        className={`px-4 py-3 text-sm min-h-10 cursor-text transition-all ${
                          isEditMode ? "hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300" : ""
                        }`}
                        onBlur={(e) => handleCellUpdate(rowIdx, colIdx, e.currentTarget.textContent || cell)}
                      >
                        {cell}
                      </div>
                    </EditableWrapper>
                  </td>
                ))}
                {isEditMode && (
                  <td className="px-2 py-3 border border-slate-200">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        removeRow(rowIdx)
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
        </tbody>
      </table>

      {isEditMode && (
        <div className="mt-4 flex gap-2">
          <button
            onClick={addRow}
            className="px-3 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Row
          </button>
          <button
            onClick={addColumn}
            className="px-3 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Column
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              const lastCol = tableData[0]?.length - 1
              if (lastCol > 0) removeColumn(lastCol)
            }}
            className="px-3 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Remove Column
          </button>
        </div>
      )}
    </div>
  )
}
