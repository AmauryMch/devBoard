import Link from "next/link"

const navItems = [
    {
        href: "/dashboard",
        label: "Accueil",
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
            </svg>
        ),
    },
    {
        href: "/dashboard/users",
        label: "Utilisateurs",
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="7" r="4" /><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" /><path d="M21 21v-2a4 4 0 0 0-3-3.85" />
            </svg>
        ),
    },
    {
        href: "/dashboard/parameters",
        label: "Paramètres",
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.07 4.93A10 10 0 0 0 4.93 19.07M19.07 19.07A10 10 0 0 0 4.93 4.93" />
            </svg>
        ),
    },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-zinc-950 text-white font-mono">
            <aside className="w-56 shrink-0 border-r border-zinc-800 flex flex-col">

                <div className="h-14 flex items-center px-5 border-b border-zinc-800">
                    <span className="text-sm font-bold tracking-widest uppercase text-white">Dashboard</span>
                </div>

                <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
                    {navItems.map(({ href, label, icon }) => (
                        <Link
                            key={href}
                            href={href}
                            className="flex items-center gap-3 px-3 py-2 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors text-sm group"
                        >
                            <span className="group-hover:text-white transition-colors">{icon}</span>
                            {label}
                        </Link>
                    ))}
                </nav>

                <div className="px-5 py-4 border-t border-zinc-800">
                    <p className="text-xs text-zinc-600">v1.0.0</p>
                </div>
            </aside>

            <div className="flex-1 flex flex-col">

                <header className="h-14 border-b border-zinc-800 flex items-center px-8 shrink-0">
                    <p className="text-xs text-zinc-500 tracking-widest uppercase">Espace Admin</p>
                </header>

                <main className="flex-1 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}