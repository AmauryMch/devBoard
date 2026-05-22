'use client';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-red-50">
            <div className="bg-white p-8 rounded shadow-lg text-center">
                <h1 className="text-4xl font-bold text-red-600 mb-4">⚠️ Erreur</h1>
                <p className="text-gray-700 mb-6">{error.message || "Une erreur est survenue"}</p>
                <button
                    onClick={() => reset()}
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                    Réessayer
                </button>
            </div>
        </div>
    );
}
