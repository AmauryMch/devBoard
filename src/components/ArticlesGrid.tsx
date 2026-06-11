"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import type { Article } from "@/services/articles"
import { FavoriteButton } from "./FavoriteButton"
import { ArticleImage } from "./ArticleImage"

const CATEGORIES = [
    { label: "Tous", value: "all", keywords: [] },
    {
        label: "Web",
        value: "web",
        keywords: ["web", "browser", "javascript", "typescript", "react", "next.js", "css", "html", "frontend", "backend", "api", "node", "npm", "framework"],
    },
    {
        label: "IA",
        value: "ai",
        keywords: ["ai", "artificial intelligence", "machine learning", "ml", "gpt", "llm", "openai", "gemini", "claude", "deep learning", "neural", "chatgpt", "copilot", "model"],
    },
    {
        label: "Cybersécurité",
        value: "cyber",
        keywords: ["security", "cyber", "hack", "vulnerability", "breach", "malware", "ransomware", "phishing", "encryption", "firewall", "exploit", "attack", "threat"],
    },
    {
        label: "Cloud",
        value: "cloud",
        keywords: ["cloud", "aws", "azure", "google cloud", "kubernetes", "docker", "serverless", "devops", "infrastructure", "container", "k8s", "deployment"],
    },
    {
        label: "Mobile",
        value: "mobile",
        keywords: ["mobile", "ios", "android", "app", "smartphone", "iphone", "pixel", "swift", "kotlin", "flutter", "tablet"],
    },
] as const

type CategoryValue = (typeof CATEGORIES)[number]["value"]

type Props = {
    articles: Article[]
    favoriteUrls: string[]
}

const ARTICLES_PER_PAGE = 12

function matchesCategory(article: Article, keywords: readonly string[]): boolean {
    if (keywords.length === 0) return true
    const text = `${article.title ?? ""} ${article.description ?? ""}`.toLowerCase()
    return keywords.some((kw) => text.includes(kw))
}

export function ArticlesGrid({ articles, favoriteUrls }: Props) {
    const [activeCategory, setActiveCategory] = useState<CategoryValue>("all")
    const [page, setPage] = useState(1)

    const category = CATEGORIES.find((c) => c.value === activeCategory)!
    const filtered = articles
        .map((article, originalIndex) => ({ article, originalIndex }))
        .filter(({ article }) => matchesCategory(article, category.keywords))

    const totalPages = Math.max(1, Math.ceil(filtered.length / ARTICLES_PER_PAGE))
    const currentPage = Math.min(page, totalPages)
    const paginated = filtered.slice((currentPage - 1) * ARTICLES_PER_PAGE, currentPage * ARTICLES_PER_PAGE)

    function handleCategoryChange(value: CategoryValue) {
        setActiveCategory(value)
        setPage(1)
    }

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" })
    }, [currentPage])

    return (
        <div>
            {/* Filtres */}
            <div className="flex flex-wrap gap-2 mb-6">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat.value}
                        onClick={() => handleCategoryChange(cat.value)}
                        className={`text-xs uppercase tracking-widest px-3 py-1.5 rounded border transition-colors ${
                            activeCategory === cat.value
                                ? "border-zinc-400 text-white bg-zinc-800"
                                : "border-zinc-700 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600"
                        }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Résultats */}
            {filtered.length === 0 ? (
                <div className="py-16 text-center border border-dashed border-zinc-800 rounded">
                    <p className="text-zinc-500 text-sm">Aucun article trouvé pour cette catégorie.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {paginated.map(({ article, originalIndex }) => (
                        <div key={originalIndex} className="relative group">
                            <Link
                                href={`/dashboard/articles/${originalIndex}`}
                                className="flex flex-col border border-zinc-800 rounded bg-zinc-900 hover:border-zinc-600 hover:bg-zinc-800 transition-colors overflow-hidden"
                            >
                                <div className="relative h-40 overflow-hidden shrink-0">
                                    {article.urlToImage ? (
                                        <ArticleImage
                                            src={article.urlToImage}
                                            alt={article.title}
                                            sourceName={article.source.name}
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
                            <div className="absolute top-2 right-2 z-10">
                                <FavoriteButton
                                    article={article}
                                    isFavorited={favoriteUrls.includes(article.url)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeCategory !== "all" && (
                <p className="text-xs text-zinc-600 mt-4 tracking-wide">
                    {filtered.length} article{filtered.length !== 1 ? "s" : ""} trouvé{filtered.length !== 1 ? "s" : ""}
                </p>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="text-xs uppercase tracking-widest px-3 py-1.5 rounded border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors disabled:opacity-30 disabled:hover:text-zinc-400 disabled:hover:border-zinc-700 disabled:cursor-not-allowed"
                    >
                        Précédent
                    </button>
                    <span className="text-xs text-zinc-500 tracking-widest px-2">
                        Page {currentPage} / {totalPages}
                    </span>
                    <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="text-xs uppercase tracking-widest px-3 py-1.5 rounded border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors disabled:opacity-30 disabled:hover:text-zinc-400 disabled:hover:border-zinc-700 disabled:cursor-not-allowed"
                    >
                        Suivant
                    </button>
                </div>
            )}
        </div>
    )
}
