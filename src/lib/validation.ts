import { z } from "zod"
import { CATEGORIES } from "@/lib/categories"

export { CATEGORIES }

export const ArticleSchema = z.object({
    title: z.string().min(1, "Le titre est requis."),
    description: z.string().min(3, "Description trop courte").max(2000, "Description trop longue."),
    url: z.string().url("L'URL n'est pas valide."),
    urlToImage: z.string().url("L'URL de l'image n'est pas valide.").optional().or(z.literal("")),
    category: z.enum(CATEGORIES, { message: "La catégorie est requise." }),
    source: z.string().min(1, "La source est requise."),
})

export type ArticleInput = z.infer<typeof ArticleSchema>
