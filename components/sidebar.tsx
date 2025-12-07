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
    <div className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 flex flex-col p-6 space-y-8 shadow-2xl">
      {/* Logo */}
      <div className="space-y-2">
        <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
          <span className="text-white font-bold text-xl">M</span>
        </div>
        <h2 className="text-base font-bold text-white tracking-tight">Memo Pro</h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1.5">
        {navItems.map((item) => (
          <button
            key={item.label}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-200 hover:translate-x-1 group"
          >
            <item.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* User Section */}
      <div className="space-y-3 border-t border-slate-700/50 pt-6">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full shadow-lg shadow-blue-500/30" />
          <div className="text-sm">
            <p className="font-semibold text-white">John Doe</p>
            <p className="text-xs text-slate-400">CEO</p>
          </div>
        </div>
        <Button variant="ghost" className="w-full justify-start text-slate-300 hover:bg-white/10 hover:text-white h-10 rounded-xl transition-all">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  )
}