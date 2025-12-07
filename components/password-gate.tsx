"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LockKeyhole } from "lucide-react"

interface PasswordGateProps {
  onSuccess: () => void
}

export default function PasswordGate({ onSuccess }: PasswordGateProps) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === "password123") {
      setError("")
      onSuccess()
    } else {
      setError("Invalid password")
      setPassword("")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          <div className="flex justify-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <LockKeyhole className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-slate-900">Secure Memo</h1>
            <p className="text-slate-600">Enter password to access</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700">
              Unlock
            </Button>
          </form>

          <p className="text-xs text-center text-slate-500">
            Demo password: <span className="font-mono">password123</span>
          </p>
        </div>
      </div>
    </div>
  )
}
