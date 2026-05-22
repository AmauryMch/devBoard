export default async function Page({
    params,
}: {
    params: Promise<{ slug?: string[] }>
}) {
    const { slug } = await params
    const segments = slug ?? []

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-10 font-mono">
            {/* Header */}
            <div className="mb-10 border-b border-zinc-800 pb-6">
                <p className="text-xs text-zinc-500 uppercase tracking-widest mb-2">Dashboard</p>
                <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
            </div>

            {/* Breadcrumb path */}
            <div className="mb-8">
                <p className="text-xs text-zinc-500 uppercase tracking-widest mb-3">Chemin actuel</p>
                {segments.length === 0 ? (
                    <div className="flex items-center gap-2 text-zinc-400">
                        <span className="text-zinc-600">/</span>
                        <span className="text-sm italic">Racine — aucun segment</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-1 flex-wrap">
                        <span className="text-zinc-600">/</span>
                        {segments.map((seg, i) => (
                            <span key={i} className="flex items-center gap-1">
                                <span className="bg-zinc-800 text-white text-sm px-3 py-1 rounded">
                                    {seg}
                                </span>
                                {i < segments.length - 1 && (
                                    <span className="text-zinc-600">/</span>
                                )}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Segments detail */}
            {segments.length > 0 && (
                <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-widest mb-3">Segments</p>
                    <div className="grid grid-cols-1 gap-2 max-w-sm">
                        {segments.map((seg, i) => (
                            <div key={i} className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded px-4 py-2">
                                <span className="text-zinc-500 text-xs">[{i}]</span>
                                <span className="text-sm">{seg}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}