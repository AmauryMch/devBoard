"use client"

import { useActionState, useState } from "react"
import { createArticle, type ArticleFormState } from "@/actions/articles"

const CATEGORIES = ["Web", "IA", "Cybersécurité", "Cloud", "Mobile"]

const initialState: ArticleFormState = { success: false, message: "" }

export default function CreateArticlePage() {
    const [state, action, pending] = useActionState(createArticle, initialState)
    const [imagePreview, setImagePreview] = useState("")

    return (
        <div className="p-8 max-w-xl">
            <h1 className="text-xl font-bold tracking-widest uppercase text-white mb-8">
                Nouvel article
            </h1>

            <form action={action} className="flex flex-col gap-5">

                <Field label="Image" name="urlToImage" error={state.errors?.urlToImage}>
                    <input
                        name="urlToImage"
                        type="url"
                        placeholder="https://... (URL de l'image)"
                        className={input(!!state.errors?.urlToImage)}
                        value={imagePreview}
                        onChange={(e) => setImagePreview(e.target.value)}
                    />
                    {imagePreview && (
                        <div className="mt-2 h-40 rounded overflow-hidden border border-zinc-800">
                            <img
                                src={imagePreview}
                                alt="Prévisualisation"
                                className="w-full h-full object-cover"
                                onError={(e) => (e.currentTarget.style.display = "none")}
                            />
                        </div>
                    )}
                </Field>

                <Field label="Titre" name="title" error={state.errors?.title}>
                    <input
                        name="title"
                        type="text"
                        placeholder="Titre de l'article"
                        className={input(!!state.errors?.title)}
                    />
                </Field>

                <Field label="Description" name="description" error={state.errors?.description}>
                    <textarea
                        name="description"
                        rows={3}
                        placeholder="Résumé de l'article"
                        className={input(!!state.errors?.description)}
                    />
                </Field>

                <Field label="URL de l'article" name="url" error={state.errors?.url}>
                    <input
                        name="url"
                        type="url"
                        placeholder="https://..."
                        className={input(!!state.errors?.url)}
                    />
                </Field>

                <Field label="Catégorie" name="category" error={state.errors?.category}>
                    <select name="category" className={input(!!state.errors?.category)}>
                        <option value="">Sélectionner une catégorie</option>
                        {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </Field>

                <Field label="Source" name="source" error={state.errors?.source}>
                    <input
                        name="source"
                        type="text"
                        placeholder="ex: Le Monde, Wired..."
                        className={input(!!state.errors?.source)}
                    />
                </Field>

                <button
                    type="submit"
                    disabled={pending}
                    className="mt-2 px-4 py-2 text-xs uppercase tracking-widest border border-zinc-700 rounded text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    {pending ? "Création..." : "Créer l'article"}
                </button>
            </form>
        </div>
    )
}

function Field({
    label,
    name,
    error,
    children,
}: {
    label: string
    name: string
    error?: string
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-col gap-1.5">
            <label htmlFor={name} className="text-xs text-zinc-500 uppercase tracking-widest">
                {label}
            </label>
            {children}
            {error && <p className="text-xs text-red-400">{error}</p>}
        </div>
    )
}

function input(hasError: boolean) {
    return [
        "bg-zinc-900 border rounded px-3 py-2 text-sm text-white placeholder-zinc-600 outline-none transition-colors w-full",
        hasError
            ? "border-red-800 focus:border-red-600"
            : "border-zinc-800 focus:border-zinc-600",
    ].join(" ")
}
