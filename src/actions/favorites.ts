"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

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
