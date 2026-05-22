import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-50">
            <div className="bg-white p-8 rounded shadow-lg text-center">
                <h1 className="text-6xl font-bold text-yellow-600 mb-4">404</h1>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Page non trouvée</h2>
                <Link
                    href="/dashboard"
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                    Retour au Dashboard
                </Link>
            </div>
        </div>
    );
}
