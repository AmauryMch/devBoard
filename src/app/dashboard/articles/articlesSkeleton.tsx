export function ArticlesSkeleton() {
    return (
        <div className="animate-pulse">
            {/* Filtres */}
            <div className="flex flex-wrap gap-2 mb-6">
                {[16, 14, 12, 20, 16, 18].map((w, i) => (
                    <div key={i} className="h-7 bg-zinc-800 rounded" style={{ width: `${w * 4}px` }} />
                ))}
            </div>

            {/* Grille de cartes */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex flex-col border border-zinc-800 rounded bg-zinc-900 overflow-hidden">
                        <div className="h-40 bg-zinc-800 shrink-0" />
                        <div className="flex flex-col flex-1 p-4 gap-3">
                            <div className="flex items-center justify-between gap-2">
                                <div className="h-3 w-20 bg-zinc-800 rounded-sm" />
                                <div className="h-3 w-16 bg-zinc-800/60 rounded-sm" />
                            </div>
                            <div className="space-y-2">
                                <div className="h-4 w-full bg-zinc-800 rounded" />
                                <div className="h-4 w-3/4 bg-zinc-800 rounded" />
                            </div>
                            <div className="space-y-2">
                                <div className="h-3 w-full bg-zinc-800/60 rounded" />
                                <div className="h-3 w-2/3 bg-zinc-800/60 rounded" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ArticlesSkeleton