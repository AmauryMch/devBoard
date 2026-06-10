import Image from "next/image"
import Link from "next/link"
import { getAllArticles } from "../../../services/articles"

export default async function ArticlesPage() {
    const articles = await getAllArticles()

    return (
        <div className="p-8">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold tracking-widest uppercase text-white">Articles</h1>
                    <p className="text-zinc-500 text-xs mt-1 tracking-wide">Veille technologique — Dev & Informatique</p>
                </div>
                <Link
                    href="/dashboard/articles/create"
                    className="text-xs uppercase tracking-widest border border-zinc-700 px-4 py-2 rounded text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors"
                >
                    + Nouvel article
                </Link>
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
                            <div className="relative h-40 overflow-hidden shrink-0">
                                {article.urlToImage ? (
                                    <Image
                                        src={article.urlToImage}
                                        alt={article.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                                        <span className="text-xs text-zinc-600 uppercase tracking-widest">
                                            {article.source.name}
                                        </span>
                                    </div>
                                )}
                            </div>
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