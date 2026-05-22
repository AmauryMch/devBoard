export function ArticleSkeleton() {
    return (
        <div className="py-10 px-6 md:px-12 animate-pulse">
            <div className="max-w-[680px] mx-auto">

                {/* Back */}
                <div className="h-3 w-16 bg-zinc-800 rounded-sm mb-12" />

                {/* Metadata */}
                <div className="flex items-center gap-3 mb-5">
                    <div className="h-4 w-20 bg-zinc-800 rounded-sm" />
                    <div className="h-3 w-28 bg-zinc-800/60 rounded-sm" />
                    <div className="h-3 w-10 bg-zinc-800/40 rounded-sm" />
                </div>

                {/* Title */}
                <div className="space-y-3 mb-8">
                    <div className="h-8 w-full bg-zinc-800 rounded" />
                    <div className="h-8 w-4/5 bg-zinc-800 rounded" />
                    <div className="h-8 w-2/3 bg-zinc-800/60 rounded" />
                </div>

                {/* Image */}
                <div className="h-64 md:h-80 w-full bg-zinc-800/50 rounded-md mb-8" />

                {/* Lead */}
                <div className="border-l-[3px] border-zinc-800 pl-5 mb-8 space-y-2">
                    <div className="h-4 w-full bg-zinc-800/70 rounded" />
                    <div className="h-4 w-11/12 bg-zinc-800/70 rounded" />
                    <div className="h-4 w-3/4 bg-zinc-800/50 rounded" />
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="h-px flex-1 bg-zinc-800" />
                    <div className="w-1 h-1 rounded-full bg-zinc-800" />
                    <div className="h-px flex-1 bg-zinc-800" />
                </div>

                {/* Paragraphs */}
                <div className="space-y-6 mb-12">
                    {[1, 0.95, 0.9, 1, 0.85, 0.92].map((w, i) => (
                        <div key={i} className="space-y-2">
                            <div className="h-4 bg-zinc-800/60 rounded" style={{ width: `${w * 100}%` }} />
                            <div className="h-4 w-full bg-zinc-800/60 rounded" />
                            <div className="h-4 bg-zinc-800/50 rounded" style={{ width: `${(w * 0.8) * 100}%` }} />
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="pt-8 border-t border-zinc-800/60 flex items-center justify-between">
                    <div className="h-3 w-32 bg-zinc-800/50 rounded-sm" />
                    <div className="h-7 w-40 bg-zinc-800/50 rounded-sm" />
                </div>

            </div>
        </div>
    )
}

export default ArticleSkeleton
