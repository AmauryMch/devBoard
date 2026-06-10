'use client';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="flex min-h-[70vh] items-center justify-center bg-zinc-950 text-white font-mono px-4">
            <div className="w-full max-w-sm border border-zinc-800 rounded-lg p-8 flex flex-col items-center gap-4 text-center">
                <span className="text-xs uppercase tracking-widest text-red-400">Erreur</span>
                <h1 className="text-2xl font-bold">Une erreur est survenue</h1>
                <p className="text-sm text-zinc-500">
                    {error.message || "Quelque chose s'est mal passé."}
                </p>
                <button
                    onClick={() => reset()}
                    className="mt-2 w-full px-4 py-2 rounded bg-white text-zinc-950 text-sm font-semibold hover:bg-zinc-200 transition-colors"
                >
                    Réessayer
                </button>
            </div>
        </div>
    );
}
