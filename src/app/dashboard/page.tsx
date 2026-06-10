import Image from "next/image"
import Link from "next/link"
import { getAllArticles } from "@/services/articles"
import { getUserFavorites, getUserFavoriteUrls } from "@/actions/favorites"
import { FavoriteButton } from "@/components/FavoriteButton"

export default async function Dashboard() {
    const [articles, favoriteUrls, favorites] = await Promise.all([
        getAllArticles(),
        getUserFavoriteUrls(),
        getUserFavorites(),
    ])

    const recentArticles = articles.slice(0, 2)

    return (
        <div className="p-8 space-y-12">

            {/* Articles Tendances */}
            <section>
                <div className="mb-6">
                    <h2 className="text-xl font-bold tracking-widest uppercase text-white">Articles Tendances</h2>
                    <p className="text-zinc-500 text-xs mt-1 tracking-wide">Les 2 articles les plus récents</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recentArticles.map((article, i) => (
                        <div key={i} className="relative group">
                            <Link
                                href={`/dashboard/articles/${i}`}
                                className="flex flex-col border border-zinc-800 rounded bg-zinc-900 hover:border-zinc-600 hover:bg-zinc-800 transition-colors overflow-hidden"
                            >
                                <div className="relative h-44 overflow-hidden shrink-0">
                                    {article.urlToImage ? (
                                        <Image
                                            src={article.urlToImage}
                                            alt={article.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                                            <span className="text-xs text-zinc-600 uppercase tracking-widest">{article.source.name}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col flex-1 p-4 gap-2">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-xs text-zinc-500 uppercase tracking-widest truncate">{article.source.name}</span>
                                        <span className="text-xs text-zinc-600 shrink-0">{new Date(article.publishedAt).toLocaleDateString("fr-FR")}</span>
                                    </div>
                                    <p className="text-sm text-white font-medium leading-snug line-clamp-3">{article.title}</p>
                                    {article.description && (
                                        <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">{article.description}</p>
                                    )}
                                </div>
                            </Link>
                            <div className="absolute top-2 right-2 z-10">
                                <FavoriteButton article={article} isFavorited={favoriteUrls.includes(article.url)} />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <div className="h-px bg-zinc-800" />

            {/* Articles Favoris */}
            <section>
                <div className="mb-6">
                    <h2 className="text-xl font-bold tracking-widest uppercase text-white">Articles Favoris</h2>
                    <p className="text-zinc-500 text-xs mt-1 tracking-wide">
                        {favorites.length} article{favorites.length !== 1 ? "s" : ""} sauvegardé{favorites.length !== 1 ? "s" : ""}
                    </p>
                </div>

                {favorites.length === 0 ? (
                    <div className="py-16 text-center border border-dashed border-zinc-800 rounded">
                        <p className="text-zinc-500 text-sm">Aucun article en favori.</p>
                        <p className="text-zinc-700 text-xs mt-2">
                            Ajoutez des articles depuis la liste en cliquant sur l&apos;étoile ★
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {favorites.map((fav) => (
                            <div key={fav.id} className="relative group">
                                <a
                                    href={fav.articleUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col border border-zinc-800 rounded bg-zinc-900 hover:border-zinc-600 hover:bg-zinc-800 transition-colors overflow-hidden"
                                >
                                    <div className="relative h-40 overflow-hidden shrink-0">
                                        {fav.articleImage ? (
                                            <img
                                                src={fav.articleImage}
                                                alt={fav.articleTitle}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                                                <span className="text-xs text-zinc-600 uppercase tracking-widest">{fav.articleSource}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col flex-1 p-4 gap-2">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-xs text-zinc-500 uppercase tracking-widest truncate">{fav.articleSource}</span>
                                            <span className="text-xs text-zinc-600 shrink-0">
                                                {new Date(fav.articlePublishedAt).toLocaleDateString("fr-FR")}
                                            </span>
                                        </div>
                                        <p className="text-sm text-white font-medium leading-snug line-clamp-3">{fav.articleTitle}</p>
                                        {fav.articleDescription && (
                                            <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">{fav.articleDescription}</p>
                                        )}
                                    </div>
                                </a>
                                <div className="absolute top-2 right-2 z-10">
                                    <FavoriteButton
                                        article={{
                                            url: fav.articleUrl,
                                            title: fav.articleTitle,
                                            description: fav.articleDescription,
                                            urlToImage: fav.articleImage,
                                            source: { name: fav.articleSource },
                                            publishedAt: fav.articlePublishedAt,
                                        }}
                                        isFavorited={true}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}
