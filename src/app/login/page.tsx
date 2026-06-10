"use client"

import { signIn } from "next-auth/react"

export default function LoginPage() {
    return (
        <div className="flex flex-1 items-center justify-center bg-zinc-950 text-white font-mono px-4">
            <div className="w-full max-w-sm border border-zinc-800 rounded-lg p-8 flex flex-col gap-6">
                <div className="text-center">
                    <h1 className="text-lg font-bold tracking-widest uppercase">Connexion</h1>
                    <p className="text-sm text-zinc-500 mt-2">Connecte-toi pour accéder à ton espace DevBoard</p>
                </div>

                <button
                    onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
                    className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded bg-white text-zinc-950 text-sm font-semibold hover:bg-zinc-200 transition-colors"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.725-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.42-1.305.763-1.605-2.665-.303-5.466-1.332-5.466-5.93 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.5 11.5 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.805 5.624-5.479 5.921.43.372.823 1.103.823 2.222 0 1.604-.014 2.896-.014 3.293 0 .319.216.694.825.576C20.565 21.795 24 17.296 24 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                    Se connecter avec GitHub
                </button>
            </div>
        </div>
    )
}
