"use client"

interface MemoHeaderProps {
  memoTitle?: string
  company?: string
  date?: string
  author?: string
}

export default function MemoHeader({
  memoTitle = "Memo",
  company = "XYZ Corp",
  date = "October 4, 2024",
  author = "Jane Doe, CEO",
}: MemoHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white px-8 py-6 rounded-lg mb-8 shadow-lg border border-slate-700">
      <h1 className="text-3xl font-bold mb-2 tracking-tight">{memoTitle}</h1>
      <p className="text-slate-300 text-lg font-light">
        {company} • {date} • {author}
      </p>
    </div>
  )
}