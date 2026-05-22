"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import type { Article } from "@/app/dashboard/articles/lib"

const customArticles: Article[] = []

export async function getCustomArticles(): Promise<Article[]> {
    return customArticles
}

export type ArticleFormState = {
    success: boolean
    message: string
    errors?: {
        title?: string
        description?: string
        url?: string
        urlToImage?: string
        category?: string
        source?: string
    }
}

export async function createArticle(
    _prev: ArticleFormState,
    formData: FormData
): Promise<ArticleFormState> {
    const title = formData.get("title")?.toString().trim() ?? ""
    const description = formData.get("description")?.toString().trim() ?? ""
    const url = formData.get("url")?.toString().trim() ?? ""
    const urlToImage = formData.get("urlToImage")?.toString().trim() ?? ""
    const category = formData.get("category")?.toString().trim() ?? ""
    const source = formData.get("source")?.toString().trim() ?? ""

    const errors: ArticleFormState["errors"] = {}

    if (!title) errors.title = "Le titre est requis."
    if (!url) errors.url = "L'URL est requise."
    else if (!/^https?:\/\/.+/.test(url)) errors.url = "L'URL n'est pas valide."
    if (!category) errors.category = "La catégorie est requise."
    if (!source) errors.source = "La source est requise."

    if (Object.keys(errors).length > 0) {
        return { success: false, message: "Formulaire invalide.", errors }
    }

    // TODO: remplacer par prisma.article.create() en production
    customArticles.unshift({
        title,
        description: description || null,
        url,
        urlToImage: urlToImage || null,
        publishedAt: new Date().toISOString(),
        source: { name: source },
        content: null,
    })

    revalidatePath("/dashboard/articles")
    redirect("/dashboard/articles")
}
