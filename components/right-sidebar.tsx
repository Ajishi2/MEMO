"use client"

export default function RightSidebar() {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-slate-900">Key Highlights</h3>
      <ul className="space-y-3 text-xs text-slate-700">
        <li className="flex gap-2">
          <span className="text-blue-600 font-bold">•</span>
          <span>$1.5M in annual recurring revenue (ARR)</span>
        </li>
        <li className="flex gap-2">
          <span className="text-blue-600 font-bold">•</span>
          <span>30% year-over-year growth</span>
        </li>
        <li className="flex gap-2">
          <span className="text-blue-600 font-bold">•</span>
          <span>15 patents for proprietary solar technology</span>
        </li>
        <li className="flex gap-2">
          <span className="text-blue-600 font-bold">•</span>
          <span>Partnerships with 10+ utility companies</span>
        </li>
      </ul>
    </div>
  )
}
