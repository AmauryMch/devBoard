import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getAllArticles } from "../../../services/articles"
import { getUserFavoriteUrls } from "@/actions/favorites"
import { ArticlesGrid } from "@/components/ArticlesGrid"

export default async function ArticlesPage() {
    const [articles, favoriteUrls, session] = await Promise.all([
        getAllArticles(),
        getUserFavoriteUrls(),
        getServerSession(authOptions),
    ])

    const role = (session?.user as { role?: string } | undefined)?.role
    const canCreate = role === "admin" || role === "editor"

    return (
        <div className="p-8">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold tracking-widest uppercase text-white">Articles</h1>
                    <p className="text-zinc-500 text-xs mt-1 tracking-wide">Veille technologique — Dev & Informatique</p>
                </div>
                {canCreate && (
                    <Link
                        href="/dashboard/articles/create"
                        className="text-xs uppercase tracking-widest border border-zinc-700 px-4 py-2 rounded text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors"
                    >
                        + Nouvel article
                    </Link>
                )}
            </div>

            {articles.length === 0 ? (
                <p className="text-zinc-500 text-sm">Impossible de charger les articles.</p>
            ) : (
                <ArticlesGrid articles={articles} favoriteUrls={favoriteUrls} />
            )}
        </div>
    )
}
