"use client"

import { useState } from "react"
import EditableWrapper, { useEditorSelection } from "../editable-wrapper"
import { Plus, Trash2 } from "lucide-react"

interface TableBlockProps {
  id: string
  isEditMode: boolean
  onDelete: () => void
  onUpdate?: (data: string[][]) => void
  data?: string[][]
}

export default function TableBlock({ id, isEditMode, onDelete, onUpdate, data }: TableBlockProps) {
  const { selectedId } = useEditorSelection()
  const isSelected = selectedId === id
  const [tableData, setTableData] = useState<string[][]>(
    data || [
      ["Metric", "Q1", "Q2", "Q3"],
      ["Revenue", "$45M", "$52M", "$61M"],
      ["Growth", "12%", "15%", "18%"],
      ["Margin", "28%", "31%", "34%"],
    ],
  )
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleCellChange = (row: number, col: number, value: string) => {
    const newData = [...tableData]
    newData[row][col] = value
    setTableData(newData)
    onUpdate?.(newData)
  }

  const addRow = () => {
    const newRow = new Array(tableData[0].length).fill("Edit me")
    setTableData([...tableData, newRow])
  }

  const removeRow = (row: number) => {
    const newData = tableData.filter((_, i) => i !== row)
    setTableData(newData)
    onUpdate?.(newData)
  }

  const addColumn = () => {
    const newData = tableData.map((row) => [...row, "Edit me"])
    setTableData(newData)
  }

  const removeColumn = (col: number) => {
    const newData = tableData.map((row) => row.filter((_, c) => c !== col))
    setTableData(newData)
  }

  return (
    <EditableWrapper
      id={id}
      isEditMode={isEditMode}
      onDelete={onDelete}
      isDragging={isDragging}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
    >
      <div
        className={`p-6 rounded-lg border-2 bg-white transition-all ${
          isEditMode ? "border-dashed border-slate-300" : "border-slate-200"
        } overflow-x-auto`}
      >
        <table className="w-full">
          <tbody>
            {tableData.map((row, rowIdx) => (
              <tr key={rowIdx} className={rowIdx % 2 === 0 ? "bg-slate-50" : "bg-white"}>
                {row.map((cell, colIdx) => (
                  <td
                    key={`${rowIdx}-${colIdx}`}
                    className={`px-4 py-3 text-sm border border-slate-200 cursor-pointer transition ${
                      isEditMode && selectedCell?.row === rowIdx && selectedCell?.col === colIdx
                        ? "bg-blue-50 ring-2 ring-blue-400"
                        : "hover:bg-blue-50"
                    }`}
                    onClick={(e) => {
                      if (isEditMode) {
                        e.stopPropagation()
                        setSelectedCell({ row: rowIdx, col: colIdx })
                      }
                    }}
                  >
                    {isEditMode && selectedCell?.row === rowIdx && selectedCell?.col === colIdx ? (
                      <input
                        autoFocus
                        type="text"
                        value={cell}
                        onChange={(e) => handleCellChange(rowIdx, colIdx, e.target.value)}
                        onBlur={() => setSelectedCell(null)}
                        className="w-full bg-transparent outline-none"
                      />
                    ) : (
                      cell
                    )}
                  </td>
                ))}
                {isEditMode && isSelected && (
                  <td className="px-2 py-3">
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

        {isEditMode && isSelected && (
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
          </div>
        )}
      </div>
    </EditableWrapper>
  )
}
