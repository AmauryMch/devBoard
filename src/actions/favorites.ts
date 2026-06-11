"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { requireAuth } from "@/lib/session"
import type { Article } from "@/services/articles"

export async function toggleFavorite(article: Omit<Article, "content">) {
    const session = await requireAuth()
    if (!session.user?.email) throw new Error("Non connecté")

    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) throw new Error("Utilisateur introuvable")

    const existing = await prisma.favorite.findUnique({
        where: { userId_articleUrl: { userId: user.id, articleUrl: article.url } },
    })

    if (existing) {
        await prisma.favorite.delete({ where: { id: existing.id } })
    } else {
        await prisma.favorite.create({
            data: {
                userId: user.id,
                articleUrl: article.url,
                articleTitle: article.title,
                articleDescription: article.description,
                articleImage: article.urlToImage,
                articleSource: article.source.name,
                articlePublishedAt: article.publishedAt,
            },
        })
    }

    revalidatePath("/dashboard")
}

export async function getUserFavoriteUrls(): Promise<string[]> {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return []

    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return []

    const favorites = await prisma.favorite.findMany({
        where: { userId: user.id },
        select: { articleUrl: true },
    })

    return favorites.map((f) => f.articleUrl)
}

export async function getUserFavorites() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return []

    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return []

    return prisma.favorite.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
    })
}
