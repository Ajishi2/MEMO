"use client"

import { useRef, useEffect, useState } from "react"
import { Plus, Sparkles } from "lucide-react"
import EditableWrapper from "./editable-wrapper"

interface LeftSidebarProps {
  isEditMode: boolean
  data: {
    problemStatement: string
    solution: string
    marketOpportunity: string
    targetMarket: { value: string; amount: string }
    goal: { value: string; amount: string }
    fundingRequest: { amount: string }
  }
  onUpdate: (updates: Partial<LeftSidebarProps["data"]>) => void
  onAddSection?: () => void
}

export default function LeftSidebar({ isEditMode, data, onUpdate, onAddSection }: LeftSidebarProps) {
  const problemStatementRef = useRef<HTMLDivElement>(null)
  const solutionRef = useRef<HTMLDivElement>(null)
  const marketOpportunityRef = useRef<HTMLDivElement>(null)
  const targetMarketValueRef = useRef<HTMLDivElement>(null)
  const targetMarketAmountRef = useRef<HTMLDivElement>(null)
  const goalValueRef = useRef<HTMLDivElement>(null)
  const goalAmountRef = useRef<HTMLDivElement>(null)
  const fundingRequestRef = useRef<HTMLDivElement>(null)
  
  // Refs for headings
  const problemStatementHeadingRef = useRef<HTMLHeadingElement>(null)
  const solutionHeadingRef = useRef<HTMLHeadingElement>(null)
  const marketOpportunityHeadingRef = useRef<HTMLHeadingElement>(null)
  const targetMarketHeadingRef = useRef<HTMLHeadingElement>(null)
  const goalHeadingRef = useRef<HTMLHeadingElement>(null)
  const fundingRequestHeadingRef = useRef<HTMLHeadingElement>(null)
  const amountSoughtHeadingRef = useRef<HTMLParagraphElement>(null)
  
  // State for heading values
  const [headings, setHeadings] = useState({
    problemStatement: "Problem Statement",
    solution: "Solution",
    marketOpportunity: "Market Opportunity",
    targetMarket: "Target Market:",
    goal: "Goal",
    fundingRequest: "Funding Request",
    amountSought: "Amount Sought:",
  })

  useEffect(() => {
    if (problemStatementRef.current && problemStatementRef.current.textContent !== data.problemStatement) {
      problemStatementRef.current.textContent = data.problemStatement
    }
  }, [data.problemStatement])

  useEffect(() => {
    if (isEditMode && problemStatementRef.current && !problemStatementRef.current.textContent) {
      problemStatementRef.current.textContent = data.problemStatement
    }
  }, [isEditMode, data.problemStatement])

  useEffect(() => {
    if (solutionRef.current) {
      solutionRef.current.textContent = data.solution
    }
  }, [data.solution])

  useEffect(() => {
    if (marketOpportunityRef.current) {
      marketOpportunityRef.current.textContent = data.marketOpportunity
    }
  }, [data.marketOpportunity])

  useEffect(() => {
    if (targetMarketValueRef.current) {
      targetMarketValueRef.current.textContent = data.targetMarket.value
    }
  }, [data.targetMarket.value])

  useEffect(() => {
    if (targetMarketAmountRef.current) {
      targetMarketAmountRef.current.textContent = data.targetMarket.amount
    }
  }, [data.targetMarket.amount])

  useEffect(() => {
    if (goalValueRef.current) {
      goalValueRef.current.textContent = data.goal.value
    }
  }, [data.goal.value])

  useEffect(() => {
    if (goalAmountRef.current) {
      goalAmountRef.current.textContent = data.goal.amount
    }
  }, [data.goal.amount])

  useEffect(() => {
    if (fundingRequestRef.current) {
      fundingRequestRef.current.textContent = data.fundingRequest.amount
    }
  }, [data.fundingRequest.amount])

  // Initialize heading refs on mount
  useEffect(() => {
    if (problemStatementHeadingRef.current) {
      problemStatementHeadingRef.current.textContent = headings.problemStatement
    }
    if (solutionHeadingRef.current) {
      solutionHeadingRef.current.textContent = headings.solution
    }
    if (marketOpportunityHeadingRef.current) {
      marketOpportunityHeadingRef.current.textContent = headings.marketOpportunity
    }
    if (targetMarketHeadingRef.current) {
      targetMarketHeadingRef.current.textContent = headings.targetMarket
    }
    if (goalHeadingRef.current) {
      goalHeadingRef.current.textContent = headings.goal
    }
    if (fundingRequestHeadingRef.current) {
      fundingRequestHeadingRef.current.textContent = headings.fundingRequest
    }
    if (amountSoughtHeadingRef.current) {
      amountSoughtHeadingRef.current.textContent = headings.amountSought
    }
  }, [])

  return (
    <div className="pt-8 px-6 pb-6 space-y-6">
      {/* Problem Statement */}
      <div className="space-y-3">
        <EditableWrapper
          id="problem-statement-heading"
          isEditMode={isEditMode}
          onDelete={() => {}}
          onUpdate={() => {
            if (problemStatementHeadingRef.current) {
              setHeadings(prev => ({
                ...prev,
                problemStatement: problemStatementHeadingRef.current?.textContent || prev.problemStatement
              }))
            }
          }}
        >
          <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white px-5 py-3 rounded-xl shadow-lg border border-slate-700/50 overflow-hidden group">
            {/* Animated background accent */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Decorative corner accent */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/20 to-transparent rounded-bl-full blur-2xl" />
            
            <div className="relative flex items-center gap-2">
              <h3
                ref={problemStatementHeadingRef}
                contentEditable={isEditMode}
                suppressContentEditableWarning
                className={`text-sm font-bold outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 rounded-lg px-2 py-1 -mx-2 -my-1 flex-1 ${
                  isEditMode 
                    ? "bg-white/5 focus:bg-white/10 transition-all" 
                    : "bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent"
                }`}
            onBlur={(e) => {
              if (isEditMode && e.currentTarget) {
                setHeadings(prev => ({
                  ...prev,
                  problemStatement: e.currentTarget?.textContent || prev.problemStatement
                }))
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                e.currentTarget.blur()
              }
            }}
              />
            </div>
          </div>
        </EditableWrapper>
        <div className="bg-gradient-to-br from-white to-slate-50 p-5 rounded-xl border border-slate-200/80 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <EditableWrapper
          id="problem-statement"
          isEditMode={isEditMode}
          onDelete={() => {}}
          onUpdate={() => {
            if (problemStatementRef.current) {
              onUpdate({ problemStatement: problemStatementRef.current.textContent || data.problemStatement })
            }
          }}
        >
          <div
            ref={problemStatementRef}
            contentEditable={isEditMode}
            suppressContentEditableWarning
            className={`text-sm text-slate-700 leading-relaxed min-h-[60px] p-2 ${
              isEditMode 
                ? "border border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/30 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:bg-white/50 transition-all outline-none rounded-lg" 
                : ""
            }`}
            onBlur={(e) => {
              if (isEditMode && e.currentTarget) {
                onUpdate({ problemStatement: e.currentTarget?.textContent || data.problemStatement })
              }
            }}
            onInput={() => {
              if (problemStatementRef.current) {
                onUpdate({ problemStatement: problemStatementRef.current.textContent || data.problemStatement })
              }
            }}
          />
        </EditableWrapper>
        </div>
      </div>

      {/* Solution */}
      <div className="space-y-3">
        <EditableWrapper
          id="solution-heading"
          isEditMode={isEditMode}
          onDelete={() => {}}
          onUpdate={() => {
            if (solutionHeadingRef.current) {
              setHeadings(prev => ({
                ...prev,
                solution: solutionHeadingRef.current?.textContent || prev.solution
              }))
            }
          }}
        >
          <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white px-5 py-3 rounded-xl shadow-lg border border-slate-700/50 overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/20 to-transparent rounded-bl-full blur-2xl" />
            <div className="relative flex items-center gap-2">
              <h3
                ref={solutionHeadingRef}
                contentEditable={isEditMode}
                suppressContentEditableWarning
                className={`text-sm font-bold outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 rounded-lg px-2 py-1 -mx-2 -my-1 flex-1 ${
                  isEditMode 
                    ? "bg-white/5 focus:bg-white/10 transition-all" 
                    : "bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent"
                }`}
                onBlur={(e) => {
                  if (isEditMode && e.currentTarget) {
                    setHeadings(prev => ({
                      ...prev,
                      solution: e.currentTarget?.textContent || prev.solution
                    }))
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    e.currentTarget.blur()
                  }
                }}
              />
            </div>
          </div>
        </EditableWrapper>
        <div className="bg-gradient-to-br from-white to-slate-50 p-5 rounded-xl border border-slate-200/80 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <EditableWrapper
          id="solution"
          isEditMode={isEditMode}
          onDelete={() => {}}
          onUpdate={() => {
            if (solutionRef.current) {
              onUpdate({ solution: solutionRef.current.textContent || data.solution })
            }
          }}
        >
          <div
            ref={solutionRef}
            contentEditable={isEditMode}
            suppressContentEditableWarning
            className={`text-sm text-slate-700 leading-relaxed min-h-[60px] p-2 ${
              isEditMode 
                ? "border border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/30 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:bg-white/50 transition-all outline-none rounded-lg" 
                : ""
            }`}
            onBlur={(e) => {
              if (isEditMode && e.currentTarget) {
                onUpdate({ solution: e.currentTarget?.textContent || data.solution })
              }
            }}
            onInput={() => {
              if (solutionRef.current) {
                onUpdate({ solution: solutionRef.current.textContent || data.solution })
              }
            }}
          />
        </EditableWrapper>
        </div>
      </div>

      {/* Market Opportunity - Bar Chart */}
      <div className="space-y-3">
        <EditableWrapper
          id="market-opportunity-heading"
          isEditMode={isEditMode}
          onDelete={() => {}}
          onUpdate={() => {
            if (marketOpportunityHeadingRef.current) {
              setHeadings(prev => ({
                ...prev,
                marketOpportunity: marketOpportunityHeadingRef.current?.textContent || prev.marketOpportunity
              }))
            }
          }}
        >
          <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white px-5 py-3 rounded-xl shadow-lg border border-slate-700/50 overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/20 to-transparent rounded-bl-full blur-2xl" />
            <div className="relative flex items-center gap-2">
              <h3
                ref={marketOpportunityHeadingRef}
                contentEditable={isEditMode}
                suppressContentEditableWarning
                className={`text-sm font-bold outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 rounded-lg px-2 py-1 -mx-2 -my-1 flex-1 ${
                  isEditMode 
                    ? "bg-white/5 focus:bg-white/10 transition-all" 
                    : "bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent"
                }`}
                onBlur={(e) => {
                  if (isEditMode && e.currentTarget) {
                    setHeadings(prev => ({
                      ...prev,
                      marketOpportunity: e.currentTarget?.textContent || prev.marketOpportunity
                    }))
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    e.currentTarget.blur()
                  }
                }}
              />
            </div>
          </div>
        </EditableWrapper>
        <div className="bg-gradient-to-br from-white to-slate-50 p-5 rounded-xl border border-slate-200/80 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-end justify-center gap-2 h-24">
            <div className="w-8 bg-blue-500 rounded" style={{ height: "60%" }}></div>
            <div className="w-8 bg-green-400 rounded" style={{ height: "45%" }}></div>
            <div className="w-8 bg-blue-500 rounded" style={{ height: "70%" }}></div>
            <div className="w-8 bg-green-400 rounded" style={{ height: "55%" }}></div>
          </div>
          <EditableWrapper
            id="market-opportunity"
            isEditMode={isEditMode}
            onDelete={() => {}}
            onUpdate={() => {
              if (marketOpportunityRef.current) {
                onUpdate({ marketOpportunity: marketOpportunityRef.current.textContent || data.marketOpportunity })
              }
            }}
          >
            <div
              ref={marketOpportunityRef}
              contentEditable={isEditMode}
              suppressContentEditableWarning
              className={`text-sm text-slate-700 text-center mt-2 p-2 ${
                isEditMode 
                  ? "border border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/30 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:bg-white/50 transition-all outline-none rounded-lg" 
                  : ""
              }`}
              onBlur={(e) => {
                if (isEditMode && e.currentTarget) {
                  onUpdate({ marketOpportunity: e.currentTarget?.textContent || data.marketOpportunity })
                }
              }}
              onInput={() => {
                if (marketOpportunityRef.current) {
                  onUpdate({ marketOpportunity: marketOpportunityRef.current.textContent || data.marketOpportunity })
                }
              }}
            />
          </EditableWrapper>
        </div>
      </div>

      {/* Target Market - Donut Chart */}
      <div className="space-y-3">
        <EditableWrapper
          id="target-market-heading"
          isEditMode={isEditMode}
          onDelete={() => {}}
          onUpdate={() => {
            if (targetMarketHeadingRef.current) {
              setHeadings(prev => ({
                ...prev,
                targetMarket: targetMarketHeadingRef.current?.textContent || prev.targetMarket
              }))
            }
          }}
        >
          <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white px-5 py-3 rounded-xl shadow-lg border border-slate-700/50 overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/20 to-transparent rounded-bl-full blur-2xl" />
            <div className="relative flex items-center gap-2">
              <h3
                ref={targetMarketHeadingRef}
                contentEditable={isEditMode}
                suppressContentEditableWarning
                className={`text-sm font-bold outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 rounded-lg px-2 py-1 -mx-2 -my-1 flex-1 ${
                  isEditMode 
                    ? "bg-white/5 focus:bg-white/10 transition-all" 
                    : "bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent"
                }`}
                onBlur={(e) => {
                  if (isEditMode && e.currentTarget) {
                    setHeadings(prev => ({
                      ...prev,
                      targetMarket: e.currentTarget?.textContent || prev.targetMarket
                    }))
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    e.currentTarget.blur()
                  }
                }}
              />
            </div>
          </div>
        </EditableWrapper>
        <div className="bg-gradient-to-br from-white to-slate-50 p-5 rounded-xl border border-slate-200/80 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="12" strokeDasharray="62.8 100" />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#fbbf24"
                strokeWidth="12"
                strokeDasharray="31.4 100"
                strokeDashoffset="-62.8"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#4ade80"
                strokeWidth="12"
                strokeDasharray="5.24 100"
                strokeDashoffset="-94.2"
              />
            </svg>
            <div className="absolute text-center">
              <EditableWrapper
                id="target-market-value"
                isEditMode={isEditMode}
                onDelete={() => {}}
                onUpdate={() => {
                  if (targetMarketValueRef.current) {
                    onUpdate({
                      targetMarket: {
                        ...data.targetMarket,
                        value: targetMarketValueRef.current.textContent || data.targetMarket.value,
                      },
                    })
                  }
                }}
              >
                <div
                  ref={targetMarketValueRef}
                  contentEditable={isEditMode}
                  suppressContentEditableWarning
                  className={`text-sm font-bold text-slate-700 p-1 ${
                    isEditMode 
                      ? "border border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/30 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:bg-white/50 transition-all outline-none rounded-lg" 
                      : ""
                  }`}
                  onBlur={(e) => {
                    if (isEditMode && e.currentTarget) {
                      onUpdate({
                        targetMarket: { ...data.targetMarket, value: e.currentTarget?.textContent || data.targetMarket.value },
                      })
                    }
                  }}
                  onInput={() => {
                    if (targetMarketValueRef.current) {
                      onUpdate({
                        targetMarket: {
                          ...data.targetMarket,
                          value: targetMarketValueRef.current.textContent || data.targetMarket.value,
                        },
                      })
                    }
                  }}
                />
              </EditableWrapper>
              <EditableWrapper
                id="target-market-amount"
                isEditMode={isEditMode}
                onDelete={() => {}}
                onUpdate={() => {
                  if (targetMarketAmountRef.current) {
                    onUpdate({
                      targetMarket: {
                        ...data.targetMarket,
                        amount: targetMarketAmountRef.current.textContent || data.targetMarket.amount,
                      },
                    })
                  }
                }}
              >
                <div
                  ref={targetMarketAmountRef}
                  contentEditable={isEditMode}
                  suppressContentEditableWarning
                  className={`text-sm text-slate-700 p-1 ${
                    isEditMode 
                      ? "border border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/30 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:bg-white/50 transition-all outline-none rounded-lg" 
                      : ""
                  }`}
                  onBlur={(e) => {
                    if (isEditMode && e.currentTarget) {
                      onUpdate({
                        targetMarket: { ...data.targetMarket, amount: e.currentTarget?.textContent || data.targetMarket.amount },
                      })
                    }
                  }}
                  onInput={() => {
                    if (targetMarketAmountRef.current) {
                      onUpdate({
                        targetMarket: {
                          ...data.targetMarket,
                          amount: targetMarketAmountRef.current.textContent || data.targetMarket.amount,
                        },
                      })
                    }
                  }}
                />
              </EditableWrapper>
            </div>
          </div>
        </div>
      </div>


      {/* Add Section Button */}
      {isEditMode && (
        <div className="pt-4 border-t border-slate-200">
          <button
            onClick={() => {
              if (onAddSection) {
                onAddSection()
              } else {
                // Default behavior: add a new text section
                console.log("Add section clicked")
              }
            }}
            className="w-full py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-blue-400 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-300 flex items-center justify-center gap-2 group/btn text-sm font-medium"
            >
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg group-hover/btn:scale-110 transition-transform">
                <Plus className="w-3 h-3 text-white" />
              </div>
            Add Section
          </button>
        </div>
      )}
    </div>
  )
}
