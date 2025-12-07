"use client"

export default function LeftSidebar() {
  return (
    <div className="p-6 space-y-6">
      {/* Problem Statement */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold bg-slate-900 text-white px-3 py-2 rounded text-white">Problem Statement</h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          Urban households face rising energy costs and unreliable power grids. Existing renewable energy solutions are
          expensive and lack efficiency in urban settings.
        </p>
      </div>

      {/* Solution */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold bg-slate-900 text-white px-3 py-2 rounded">Solution</h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          GreenTech Solutions provides compact, affordable, and high-efficiency solar energy storage units. Our
          SolarCube combines cutting-edge solar cells with AI-driven energy management.
        </p>
      </div>

      {/* Market Opportunity - Bar Chart */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold bg-slate-900 text-white px-3 py-2 rounded">Market Opportunity</h3>
        <div className="bg-slate-50 p-4 rounded-lg">
          <div className="flex items-end justify-center gap-2 h-24">
            <div className="w-8 bg-blue-500 rounded" style={{ height: "60%" }}></div>
            <div className="w-8 bg-green-400 rounded" style={{ height: "45%" }}></div>
            <div className="w-8 bg-blue-500 rounded" style={{ height: "70%" }}></div>
            <div className="w-8 bg-green-400 rounded" style={{ height: "55%" }}></div>
          </div>
          <p className="text-xs text-slate-500 text-center mt-2">Category 1 vs Category 2</p>
        </div>
      </div>

      {/* Target Market - Donut Chart */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold bg-slate-900 text-white px-3 py-2 rounded">Target Market:</h3>
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
              <p className="text-xs font-bold">1,234</p>
              <p className="text-xs text-slate-500">$100K</p>
            </div>
          </div>
        </div>
      </div>

      {/* Goal - Donut Chart */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold bg-slate-900 text-white px-3 py-2 rounded">Goal</h3>
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
              <p className="text-xs font-bold">40%</p>
              <p className="text-xs text-slate-500">$100K</p>
            </div>
          </div>
        </div>
      </div>

      {/* Funding Request */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold bg-slate-900 text-white px-3 py-2 rounded">Funding Request</h3>
        <p className="text-xs font-semibold text-slate-900">Amount Sought: $2M</p>
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
              <p className="text-xs font-bold">$2M</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
