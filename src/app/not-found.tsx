import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white font-mono px-4">
            <div className="w-full max-w-sm border border-zinc-800 rounded-lg p-8 flex flex-col items-center gap-4 text-center">
                <span className="text-xs uppercase tracking-widest text-zinc-500">Erreur 404</span>
                <h1 className="text-5xl font-bold">404</h1>
                <h2 className="text-sm uppercase tracking-widest text-zinc-400">Page non trouvée</h2>
                <p className="text-sm text-zinc-500">
                    La page que vous recherchez n&apos;existe pas ou a été déplacée.
                </p>
                <Link
                    href="/dashboard"
                    className="mt-2 w-full px-4 py-2 rounded bg-white text-zinc-950 text-sm font-semibold hover:bg-zinc-200 transition-colors text-center"
                >
                    Retour au dashboard
                </Link>
            </div>
        </div>
    );
}
