"use client"

import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import EditableWrapper from "../editable-wrapper"

interface BarItem {
  id: string
  topLabel: string
  barText: string
  value: number
  bottomLabel: string
  color: string
}

interface BarChartBlockProps {
  isEditMode: boolean
  onDelete: () => void
}

const colors = [
  "bg-gradient-to-t from-green-600 to-emerald-500",
  "bg-gradient-to-t from-orange-500 to-amber-400",
  "bg-gradient-to-t from-yellow-500 to-yellow-400",
  "bg-gradient-to-t from-green-500 to-emerald-400",
  "bg-gradient-to-t from-red-500 to-rose-400",
]

export default function BarChartBlock({ isEditMode, onDelete }: BarChartBlockProps) {
  const [bars, setBars] = useState<BarItem[]>([
    {
      id: "1",
      topLabel: "Elit accumsan",
      barText: "Nullam dictumst a fames interdum ut",
      value: 2,
      bottomLabel: "Product A",
      color: "bg-gradient-to-t from-green-600 to-emerald-500",
    },
    {
      id: "2",
      topLabel: "Risus blandit",
      barText: "Cum tempor tortor urna mi quis. Odio",
      value: 7,
      bottomLabel: "Product B",
      color: "bg-gradient-to-t from-orange-500 to-amber-400",
    },
    {
      id: "3",
      topLabel: "Bibendum",
      barText: "Pretium leo etiam malesuada cursus",
      value: 13,
      bottomLabel: "Product C",
      color: "bg-gradient-to-t from-yellow-500 to-yellow-400",
    },
    {
      id: "4",
      topLabel: "Ac sit eu",
      barText: "Donec nunc commodo erat",
      value: 20,
      bottomLabel: "Product D",
      color: "bg-gradient-to-t from-green-500 to-emerald-400",
    },
    {
      id: "5",
      topLabel: "Curabitur",
      barText: "Ornare egestas erat a in maecenas",
      value: 37,
      bottomLabel: "Product E",
      color: "bg-gradient-to-t from-red-500 to-rose-400",
    },
  ])

  const maxValue = Math.max(...bars.map((b) => b.value), 40)

  const addBar = () => {
    setBars([
      ...bars,
      {
        id: Date.now().toString(),
        topLabel: "New Category",
        barText: "Add your description here",
        value: 5,
        bottomLabel: "New Item",
        color: colors[bars.length % colors.length],
      },
    ])
  }

  const updateBar = (id: string, field: keyof BarItem, value: string | number) => {
    setBars(bars.map((bar) => (bar.id === id ? { ...bar, [field]: value } : bar)))
  }

  const deleteBar = (id: string) => {
    setBars(bars.filter((b) => b.id !== id))
  }

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes shimmer {
          0%, 100% { transform: translateY(100%); }
          50% { transform: translateY(-100%); }
        }
        @keyframes fadeInGrid {
          from {
            opacity: 0;
            transform: scaleX(0);
          }
          to {
            opacity: 0.3;
            transform: scaleX(1);
          }
        }
      `,
        }}
      />

      <div className="group relative">
        <div
          className={`p-8 rounded-lg border-2 ${isEditMode ? "border-dashed border-slate-300" : "border-slate-200"} bg-gradient-to-br from-white to-slate-50 transition-all`}
        >
          <div className="space-y-8">
            <div className="w-full overflow-x-auto overflow-y-visible">
              <div
                className="flex items-end justify-center gap-6 h-96 pb-4 min-w-min px-4 relative"
                style={{ overflow: "visible" }}
              >
                {/* Animated grid lines */}
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-full border-t border-slate-200 opacity-30"
                      style={{
                        bottom: `${(i + 1) * 20}%`,
                        animation: `fadeInGrid 0.6s ease-out ${i * 0.1}s backwards`,
                      }}
                    />
                  ))}
                </div>

                {bars.map((bar, index) => (
                  <div
                    key={bar.id}
                    className="flex flex-col items-center gap-3 relative min-w-[140px]"
                    style={{
                      animation: `slideUp 0.6s ease-out ${index * 0.1}s backwards`,
                    }}
                  >
                    {/* Top Label - now uses EditableWrapper for toolbar support */}
                    <EditableWrapper
                      id={`top-label-${bar.id}`}
                      isEditMode={isEditMode}
                      onDelete={() => deleteBar(bar.id)}
                      onUpdate={(data) => updateBar(bar.id, "topLabel", data?.textContent || bar.topLabel)}
                    >
                      <div
                        contentEditable={isEditMode}
                        suppressContentEditableWarning
                        className="text-sm font-semibold text-purple-900 text-center bg-transparent border-b border-dashed border-purple-300 focus:outline-none focus:border-purple-500 w-full px-2 cursor-text transition-all"
                        onBlur={(e) => {
                          updateBar(bar.id, "topLabel", e.currentTarget.textContent || "")
                        }}
                      >
                        {bar.topLabel}
                      </div>
                    </EditableWrapper>

                    <div className="relative">
                      {/* Bar with shimmer effect - height updates dynamically with value */}
                      <div
                        className={`${bar.color} rounded-2xl transition-all duration-500 ease-out relative shadow-lg flex flex-col items-center justify-center p-4 text-white`}
                        style={{
                          width: "140px",
                          minHeight: "120px",
                          height: `${Math.max((bar.value / maxValue) * 320, 120)}px`,
                          overflow: "visible",
                        }}
                      >
                        {/* Shimmer overlay */}
                        <div
                          className="absolute inset-0 opacity-30 pointer-events-none"
                          style={{
                            background: "linear-gradient(to top, transparent, rgba(255,255,255,0.4), transparent)",
                            animation: "shimmer 2s ease-in-out infinite",
                          }}
                        />

                        {/* Value - now uses EditableWrapper for toolbar support */}
                        <EditableWrapper
                          id={`value-${bar.id}`}
                          isEditMode={isEditMode}
                          onDelete={() => deleteBar(bar.id)}
                          onUpdate={(data) => {
                            const val = Number.parseInt(data?.textContent || "0")
                            updateBar(bar.id, "value", val)
                          }}
                        >
                          <div
                            contentEditable={isEditMode}
                            suppressContentEditableWarning
                            className="text-4xl font-bold bg-transparent text-white text-center border-b border-dashed border-white/50 focus:outline-none focus:border-white w-20 mb-2 cursor-text transition-all"
                            onBlur={(e) => {
                              const val = Number.parseInt(e.currentTarget.textContent || "0")
                              updateBar(bar.id, "value", val)
                            }}
                          >
                            {bar.value}
                          </div>
                        </EditableWrapper>

                        {/* Bar text with toolbar support */}
                        <EditableWrapper
                          id={`bar-text-${bar.id}`}
                          isEditMode={isEditMode}
                          onDelete={() => deleteBar(bar.id)}
                          onUpdate={(data) => updateBar(bar.id, "barText", data?.textContent || bar.barText)}
                        >
                          <div
                            contentEditable={isEditMode}
                            suppressContentEditableWarning
                            className="text-xs text-white text-center bg-transparent border border-dashed border-white/30 focus:outline-none focus:border-white rounded p-1 min-h-[60px] cursor-text transition-all"
                            onBlur={(e) => {
                              updateBar(bar.id, "barText", e.currentTarget?.textContent || bar.barText)
                            }}
                          />
                        </EditableWrapper>
                      </div>
                    </div>

                    {/* Bottom Label - now uses EditableWrapper for toolbar support */}
                    <EditableWrapper
                      id={`bottom-label-${bar.id}`}
                      isEditMode={isEditMode}
                      onDelete={() => deleteBar(bar.id)}
                      onUpdate={(data) => updateBar(bar.id, "bottomLabel", data?.textContent || bar.bottomLabel)}
                    >
                      <div
                        contentEditable={isEditMode}
                        suppressContentEditableWarning
                        className="text-sm font-medium text-slate-700 text-center bg-transparent border-b border-dashed border-slate-300 focus:outline-none focus:border-slate-500 w-full px-2 cursor-text transition-all"
                        onBlur={(e) => {
                          updateBar(bar.id, "bottomLabel", e.currentTarget.textContent || "")
                        }}
                      >
                        {bar.bottomLabel}
                      </div>
                    </EditableWrapper>

                    {isEditMode && (
                      <button
                        onClick={() => deleteBar(bar.id)}
                        className="mt-1 transition-all duration-200 hover:scale-125 hover:rotate-90"
                      >
                        <X className="w-4 h-4 text-red-500 hover:text-red-700" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Axis */}
            <div className="border-t-2 border-slate-300 relative overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-200 to-transparent opacity-50"
                style={{ animation: "shimmer 3s ease-in-out infinite" }}
              />
            </div>

            {isEditMode && (
              <Button
                size="sm"
                variant="outline"
                onClick={addBar}
                className="gap-2 bg-transparent hover:bg-blue-50 transition-all duration-300 hover:shadow-md hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                Add Bar
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
