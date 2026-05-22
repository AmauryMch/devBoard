import { Suspense } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getArticles, fetchFullContent } from "../lib"
import { ArticleSkeleton } from "./articleSkeleton"

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params

    return (
        <Suspense fallback={<ArticleSkeleton />}>
            <ArticleContent slug={slug} />
        </Suspense>
    )
}

async function ArticleContent({ slug }: { slug: string }) {
    const articles = await getArticles()
    const article = articles[Number(slug)]

    if (!article) notFound()

    const fullContent = await fetchFullContent(article.url)
    const body = fullContent ?? article.content ?? article.description
    const paragraphs = body?.split("\n\n").filter((p) => p.trim().length > 0) ?? []

    const readingTime = paragraphs.length > 0
        ? Math.max(1, Math.round(paragraphs.join(" ").split(/\s+/).length / 200))
        : null

    return (
        <div className="py-10 px-6 md:px-12">
            <div className="max-w-[680px] mx-auto">

                {/* Back */}
                <Link
                    href="/dashboard/articles"
                    className="inline-flex items-center gap-2 text-[11px] font-mono text-zinc-600 hover:text-zinc-400 transition-colors mb-12 group uppercase tracking-widest"
                >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform">
                        <path d="M19 12H5M12 5l-7 7 7 7" />
                    </svg>
                    Retour
                </Link>

                {/* Metadata row */}
                <div className="flex items-center gap-3 mb-5 font-mono flex-wrap">
                    <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-[0.15em] border border-zinc-700 px-2 py-0.5 rounded-sm">
                        {article.source.name}
                    </span>
                    <span className="text-xs text-zinc-600">
                        {new Date(article.publishedAt).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        })}
                    </span>
                    {readingTime && (
                        <span className="text-xs text-zinc-700">{readingTime} min</span>
                    )}
                </div>

                {/* Title */}
                <h1 className="text-[26px] md:text-[32px] font-bold text-white leading-[1.25] tracking-tight mb-8 font-sans">
                    {article.title}
                </h1>

                {/* Image */}
                {article.urlToImage && (
                    <div className="rounded-md overflow-hidden mb-8 border border-zinc-800/60">
                        <img src={article.urlToImage} alt="" className="w-full object-cover max-h-64 md:max-h-80" />
                    </div>
                )}

                {/* Lead */}
                {article.description && paragraphs.length > 0 && (
                    <p className="text-base text-zinc-300 leading-relaxed font-sans border-l-[3px] border-zinc-600 pl-5 mb-8 italic">
                        {article.description}
                    </p>
                )}

                {/* Divider */}
                {paragraphs.length > 0 && (
                    <div className="flex items-center gap-3 mb-8">
                        <div className="h-px flex-1 bg-zinc-800" />
                        <div className="w-1 h-1 rounded-full bg-zinc-700" />
                        <div className="h-px flex-1 bg-zinc-800" />
                    </div>
                )}

                {/* Body */}
                {paragraphs.length > 0 ? (
                    <div className="space-y-6 mb-12">
                        {paragraphs.map((paragraph, i) => (
                            <p key={i} className="text-[15px] font-sans text-zinc-400 leading-[1.9] tracking-wide">
                                {paragraph}
                            </p>
                        ))}
                    </div>
                ) : (
                    <div className="mb-12 py-12 text-center border border-dashed border-zinc-800 rounded-md">
                        <p className="text-zinc-500 text-sm font-sans">Contenu non disponible.</p>
                        <p className="text-zinc-700 text-xs mt-2 font-sans">Consultez le site source pour lire l&apos;article complet.</p>
                    </div>
                )}

                {/* Footer */}
                <div className="pt-8 border-t border-zinc-800/60 flex items-center justify-between gap-4 flex-wrap">
                    <p className="text-xs font-mono text-zinc-700">
                        Source : {article.source.name}
                    </p>
                    <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 text-[11px] font-mono uppercase tracking-widest text-zinc-400 border border-zinc-700 rounded-sm hover:text-white hover:border-zinc-500 transition-colors"
                    >
                        Lire l&apos;article complet
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                    </a>
                </div>

            </div>
        </div>
    )
}
