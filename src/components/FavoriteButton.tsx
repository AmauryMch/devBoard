"use client"

import { useOptimistic, useTransition } from "react"
import { toggleFavorite } from "@/actions/favorites"
import type { Article } from "@/services/articles"

type Props = {
    article: Omit<Article, "content">
    isFavorited: boolean
}

export function FavoriteButton({ article, isFavorited }: Props) {
    const [optimisticFavorited, setOptimisticFavorited] = useOptimistic(isFavorited)
    const [isPending, startTransition] = useTransition()

    return (
        <button
            onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                startTransition(async () => {
                    setOptimisticFavorited(!optimisticFavorited)
                    await toggleFavorite(article)
                })
            }}
            disabled={isPending}
            title={optimisticFavorited ? "Retirer des favoris" : "Ajouter aux favoris"}
            className={`p-1.5 rounded transition-colors bg-zinc-900/80 backdrop-blur-sm border border-zinc-700 ${
                optimisticFavorited ? "text-yellow-400 hover:text-yellow-300" : "text-zinc-500 hover:text-zinc-300"
            }`}
        >
            <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill={optimisticFavorited ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
        </button>
    )
}
