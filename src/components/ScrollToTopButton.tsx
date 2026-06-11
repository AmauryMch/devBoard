"use client"

import { useEffect, useState } from "react"

export function ScrollToTopButton() {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        function onScroll() {
            setVisible(window.scrollY > 400)
        }
        window.addEventListener("scroll", onScroll)
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    if (!visible) return null

    return (
        <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Revenir en haut"
            className="fixed bottom-6 right-6 z-20 flex items-center justify-center w-10 h-10 rounded-full border border-zinc-700 bg-zinc-900/90 text-zinc-400 hover:text-white hover:border-zinc-500 backdrop-blur transition-colors shadow-lg"
        >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
        </button>
    )
}
