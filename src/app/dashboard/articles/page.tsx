import Link from "next/link"
import { getArticles } from "./lib"

export default async function ArticlesPage() {
    const articles = await getArticles()

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-xl font-bold tracking-widest uppercase text-white">Articles</h1>
                <p className="text-zinc-500 text-xs mt-1 tracking-wide">Veille technologique — Dev & Informatique</p>
            </div>

            {articles.length === 0 ? (
                <p className="text-zinc-500 text-sm">Impossible de charger les articles.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {articles.map((article, i) => (
                        <Link
                            key={i}
                            href={`/dashboard/articles/${i}`}
                            className="flex flex-col border border-zinc-800 rounded bg-zinc-900 hover:border-zinc-600 hover:bg-zinc-800 transition-colors overflow-hidden group"
                        >
                            {article.urlToImage && (
                                <div className="h-40 overflow-hidden">
                                    <img
                                        src={article.urlToImage}
                                        alt=""
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                            )}
                            <div className="flex flex-col flex-1 p-4 gap-2">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-xs text-zinc-500 uppercase tracking-widest truncate">
                                        {article.source.name}
                                    </span>
                                    <span className="text-xs text-zinc-600 shrink-0">
                                        {new Date(article.publishedAt).toLocaleDateString("fr-FR")}
                                    </span>
                                </div>
                                <p className="text-sm text-white font-medium leading-snug line-clamp-3">
                                    {article.title}
                                </p>
                                {article.description && (
                                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                                        {article.description}
                                    </p>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}