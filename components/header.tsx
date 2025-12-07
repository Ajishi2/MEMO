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
    <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-8 py-6 rounded-lg mb-8 shadow-md">
      <h1 className="text-3xl font-bold mb-2">{memoTitle}</h1>
      <p className="text-indigo-100 text-lg">
        {company} • {date} • {author}
      </p>
    </div>
  )
}
