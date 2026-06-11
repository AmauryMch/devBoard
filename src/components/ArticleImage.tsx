"use client"

import { useState } from "react"
import Image from "next/image"

type Props = {
    src: string
    alt: string
    /** Nom de la source affiché en fallback si l'image ne se charge pas. */
    sourceName: string
    sizes?: string
    className?: string
    /** Classe du conteneur de fallback (par défaut : remplit le parent). */
    fallbackClassName?: string
}

/**
 * Image d'article venant d'une source externe non maîtrisée.
 * - `unoptimized` : contourne l'optimiseur Next (`/_next/image`), qui se fait
 *   refuser (403) par les sites avec protection anti-hotlink.
 * - Fallback : affiche le nom de la source si le chargement échoue.
 *
 * Utilise `fill`, le parent doit donc être positionné (`relative`).
 */
export function ArticleImage({ src, alt, sourceName, sizes, className, fallbackClassName }: Props) {
    const [failed, setFailed] = useState(false)

    if (failed) {
        return (
            <div
                className={
                    fallbackClassName ??
                    "w-full h-full bg-zinc-800 flex items-center justify-center"
                }
            >
                <span className="text-xs text-zinc-600 uppercase tracking-widest text-center px-2">
                    {sourceName}
                </span>
            </div>
        )
    }

    return (
        <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            unoptimized
            className={className}
            onError={() => setFailed(true)}
        />
    )
}
