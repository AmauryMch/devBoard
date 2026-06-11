import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import type { Article } from "@/services/articles"

// Ajoute / retire un favori. La route est protégée par le middleware
// (redirection vers /login si invité) ; ce contrôle reste un filet serveur.
export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Non connecté" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) {
        return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 })
    }

    const article = (await req.json()) as Omit<Article, "content">

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
    return NextResponse.json({ favorited: !existing })
}
