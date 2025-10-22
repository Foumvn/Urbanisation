"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import DPAutoDashboard from "@/components/dashboard"

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("dp-auto-authenticated")
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [router])

  return <DPAutoDashboard />
}
