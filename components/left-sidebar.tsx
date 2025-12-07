"use client"

import { useRef, useEffect, useState } from "react"
import { Plus } from "lucide-react"
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
    <div className="p-6 space-y-6">
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
          <h3
            ref={problemStatementHeadingRef}
            contentEditable={isEditMode}
            suppressContentEditableWarning
            className="text-sm font-bold bg-slate-900 text-white px-3 py-2 rounded outline-none focus:ring-2 focus:ring-blue-400"
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
        </EditableWrapper>
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
            className={`text-xs text-slate-600 leading-relaxed min-h-[60px] p-2 ${
              isEditMode ? "border border-dashed border-slate-300 rounded" : ""
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
          <h3
            ref={solutionHeadingRef}
            contentEditable={isEditMode}
            suppressContentEditableWarning
            className="text-sm font-bold bg-slate-900 text-white px-3 py-2 rounded outline-none focus:ring-2 focus:ring-blue-400"
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
        </EditableWrapper>
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
            className={`text-xs text-slate-600 leading-relaxed min-h-[60px] p-2 ${
              isEditMode ? "border border-dashed border-slate-300 rounded" : ""
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
          <h3
            ref={marketOpportunityHeadingRef}
            contentEditable={isEditMode}
            suppressContentEditableWarning
            className="text-sm font-bold bg-slate-900 text-white px-3 py-2 rounded outline-none focus:ring-2 focus:ring-blue-400"
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
        </EditableWrapper>
        <div className="bg-slate-50 p-4 rounded-lg">
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
              className={`text-xs text-slate-500 text-center mt-2 p-2 ${
                isEditMode ? "border border-dashed border-slate-300 rounded" : ""
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
          <h3
            ref={targetMarketHeadingRef}
            contentEditable={isEditMode}
            suppressContentEditableWarning
            className="text-sm font-bold bg-slate-900 text-white px-3 py-2 rounded outline-none focus:ring-2 focus:ring-blue-400"
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
        </EditableWrapper>
        <div className="bg-slate-50 p-4 rounded-lg flex flex-col items-center">
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
                  className={`text-xs font-bold p-1 ${
                    isEditMode ? "border border-dashed border-slate-300 rounded" : ""
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
                  className={`text-xs text-slate-500 p-1 ${
                    isEditMode ? "border border-dashed border-slate-300 rounded" : ""
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

      {/* Goal - Donut Chart */}
      <div className="space-y-3">
        <EditableWrapper
          id="goal-heading"
          isEditMode={isEditMode}
          onDelete={() => {}}
          onUpdate={() => {
            if (goalHeadingRef.current) {
              setHeadings(prev => ({
                ...prev,
                goal: goalHeadingRef.current?.textContent || prev.goal
              }))
            }
          }}
        >
          <h3
            ref={goalHeadingRef}
            contentEditable={isEditMode}
            suppressContentEditableWarning
            className="text-sm font-bold bg-slate-900 text-white px-3 py-2 rounded outline-none focus:ring-2 focus:ring-blue-400"
            onBlur={(e) => {
              if (isEditMode && e.currentTarget) {
                setHeadings(prev => ({
                  ...prev,
                  goal: e.currentTarget?.textContent || prev.goal
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
        </EditableWrapper>
        <div className="bg-slate-50 p-4 rounded-lg flex flex-col items-center">
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
                id="goal-value"
                isEditMode={isEditMode}
                onDelete={() => {}}
                onUpdate={() => {
                  if (goalValueRef.current) {
                    onUpdate({ goal: { ...data.goal, value: goalValueRef.current.textContent || data.goal.value } })
                  }
                }}
              >
                <div
                  ref={goalValueRef}
                  contentEditable={isEditMode}
                  suppressContentEditableWarning
                  className={`text-xs font-bold p-1 ${
                    isEditMode ? "border border-dashed border-slate-300 rounded" : ""
                  }`}
                  onBlur={(e) => {
                    if (isEditMode && e.currentTarget) {
                      onUpdate({ goal: { ...data.goal, value: e.currentTarget?.textContent || data.goal.value } })
                    }
                  }}
                  onInput={() => {
                    if (goalValueRef.current) {
                      onUpdate({ goal: { ...data.goal, value: goalValueRef.current.textContent || data.goal.value } })
                    }
                  }}
                />
              </EditableWrapper>
              <EditableWrapper
                id="goal-amount"
                isEditMode={isEditMode}
                onDelete={() => {}}
                onUpdate={() => {
                  if (goalAmountRef.current) {
                    onUpdate({ goal: { ...data.goal, amount: goalAmountRef.current.textContent || data.goal.amount } })
                  }
                }}
              >
                <div
                  ref={goalAmountRef}
                  contentEditable={isEditMode}
                  suppressContentEditableWarning
                  className={`text-xs text-slate-500 p-1 ${
                    isEditMode ? "border border-dashed border-slate-300 rounded" : ""
                  }`}
                  onBlur={(e) => {
                    if (isEditMode && e.currentTarget) {
                      onUpdate({ goal: { ...data.goal, amount: e.currentTarget?.textContent || data.goal.amount } })
                    }
                  }}
                  onInput={() => {
                    if (goalAmountRef.current) {
                      onUpdate({ goal: { ...data.goal, amount: goalAmountRef.current.textContent || data.goal.amount } })
                    }
                  }}
                />
              </EditableWrapper>
            </div>
          </div>
        </div>
      </div>

      {/* Funding Request */}
      <div className="space-y-3">
        <EditableWrapper
          id="funding-request-heading"
          isEditMode={isEditMode}
          onDelete={() => {}}
          onUpdate={() => {
            if (fundingRequestHeadingRef.current) {
              setHeadings(prev => ({
                ...prev,
                fundingRequest: fundingRequestHeadingRef.current?.textContent || prev.fundingRequest
              }))
            }
          }}
        >
          <h3
            ref={fundingRequestHeadingRef}
            contentEditable={isEditMode}
            suppressContentEditableWarning
            className="text-sm font-bold bg-slate-900 text-white px-3 py-2 rounded outline-none focus:ring-2 focus:ring-blue-400"
            onBlur={(e) => {
              if (isEditMode && e.currentTarget) {
                setHeadings(prev => ({
                  ...prev,
                  fundingRequest: e.currentTarget?.textContent || prev.fundingRequest
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
        </EditableWrapper>
        <EditableWrapper
          id="amount-sought-heading"
          isEditMode={isEditMode}
          onDelete={() => {}}
          onUpdate={() => {
            if (amountSoughtHeadingRef.current) {
              setHeadings(prev => ({
                ...prev,
                amountSought: amountSoughtHeadingRef.current?.textContent || prev.amountSought
              }))
            }
          }}
        >
          <p
            ref={amountSoughtHeadingRef}
            contentEditable={isEditMode}
            suppressContentEditableWarning
            className="text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-blue-400 rounded px-1"
            onBlur={(e) => {
              if (isEditMode && e.currentTarget) {
                setHeadings(prev => ({
                  ...prev,
                  amountSought: e.currentTarget?.textContent || prev.amountSought
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
        </EditableWrapper>
        <div className="bg-slate-50 p-4 rounded-lg flex flex-col items-center">
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
                id="funding-request"
                isEditMode={isEditMode}
                onDelete={() => {}}
                onUpdate={() => {
                  if (fundingRequestRef.current) {
                    onUpdate({ fundingRequest: { amount: fundingRequestRef.current.textContent || data.fundingRequest.amount } })
                  }
                }}
              >
                <div
                  ref={fundingRequestRef}
                  contentEditable={isEditMode}
                  suppressContentEditableWarning
                  className={`text-xs font-bold p-1 ${
                    isEditMode ? "border border-dashed border-slate-300 rounded" : ""
                  }`}
                  onBlur={(e) => {
                    if (isEditMode) {
                      onUpdate({ fundingRequest: { amount: e.currentTarget.textContent || data.fundingRequest.amount } })
                    }
                  }}
                  onInput={() => {
                    if (fundingRequestRef.current) {
                      onUpdate({ fundingRequest: { amount: fundingRequestRef.current.textContent || data.fundingRequest.amount } })
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
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Section
          </button>
        </div>
      )}
    </div>
  )
}
