"use client"

import { useState } from "react"
import PasswordGate from "@/components/password-gate"
import MemoEditor from "@/components/memo-editor"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  if (!isAuthenticated) {
    return <PasswordGate onSuccess={() => setIsAuthenticated(true)} />
  }

  return <MemoEditor />
}
