"use client"

import { LayoutGrid, Megaphone, BookOpen, Settings, HelpCircle, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

const navItems = [
  { icon: LayoutGrid, label: "Dashboard", href: "#" },
  { icon: Megaphone, label: "Campaign", href: "#" },
  { icon: BookOpen, label: "Resources", href: "#" },
  { icon: Settings, label: "Settings", href: "#" },
  { icon: HelpCircle, label: "Support", href: "#" },
]

export default function Sidebar() {
  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col p-6 space-y-8">
      {/* Logo */}
      <div className="space-y-1">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">M</span>
        </div>
        <h2 className="text-sm font-semibold text-slate-900">Memo Pro</h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.label}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <item.icon className="w-4 h-4" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* User Section */}
      <div className="space-y-3 border-t border-slate-200 pt-4">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full" />
          <div className="text-sm">
            <p className="font-medium text-slate-900">John Doe</p>
            <p className="text-xs text-slate-500">CEO</p>
          </div>
        </div>
        <Button variant="ghost" className="w-full justify-start text-slate-600 hover:bg-slate-100 h-9">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  )
}
