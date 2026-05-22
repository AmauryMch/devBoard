"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { insertArticle } from "@/services/articles"
import { ArticleSchema, type ArticleInput } from "@/lib/validation"

export type ArticleFormState = {
    success: boolean
    message: string
    errors?: Partial<Record<keyof ArticleInput, string>>
}

export async function createArticle(
    _prev: ArticleFormState,
    formData: FormData
): Promise<ArticleFormState> {
    const raw = {
        title: formData.get("title"),
        description: formData.get("description"),
        url: formData.get("url"),
        urlToImage: formData.get("urlToImage"),
        category: formData.get("category"),
        source: formData.get("source"),
    }

    const result = ArticleSchema.safeParse(raw)

    if (!result.success) {
        const errors: ArticleFormState["errors"] = {}
        for (const [k, v] of Object.entries(result.error.flatten().fieldErrors)) {
            if (v?.[0]) errors[k as keyof ArticleInput] = v[0]
        }
        return { success: false, message: "Formulaire invalide.", errors }
    }

    const { title, description, url, urlToImage, source } = result.data
    insertArticle({
        title,
        description: description ?? null,
        url,
        urlToImage: urlToImage ?? null,
        publishedAt: new Date().toISOString(),
        source: { name: source },
    })

    revalidatePath("/dashboard/articles")
    redirect("/dashboard/articles")
}
