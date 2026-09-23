"use client"

import { useEffect } from "react"

export default function VisitorTracker() {
  useEffect(() => {
    if (sessionStorage.getItem("visitorLogged")) return

    const sendVisit = async () => {
      try {
        const response = await fetch("/api/visitor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            page: window.location.pathname,
            referrer: document.referrer,
          }),
          keepalive: true,
        })

        if (!response.ok) {
          const result = await response.json().catch(() => null)
          console.error("Visitor logging failed:", result?.error || response.status)
          return
        }

        sessionStorage.setItem("visitorLogged", "1")
      } catch (error) {
        console.error("Visitor logging request failed:", error)
      }
    }

    void sendVisit()
  }, [])

  return null
}
