import { getServerSession } from "next-auth"
import type { Session } from "next-auth"
import { authOptions } from "@/lib/auth"

export type SessionUser = Session["user"] & { role?: string }

/**
 * Vérifie qu'une session existe (utilisateur connecté).
 * Lève une erreur sinon. À utiliser au début d'une server action / route protégée.
 */
export async function requireAuth(): Promise<Session> {
    const session = await getServerSession(authOptions)
    if (!session?.user) throw new Error("Non connecté")
    return session
}

/**
 * Vérifie que l'utilisateur connecté possède l'un des rôles donnés.
 * Lève une erreur si non connecté ou rôle insuffisant.
 */
export async function requireRole(...roles: string[]): Promise<Session> {
    const session = await requireAuth()
    const role = (session.user as SessionUser).role
    if (roles.length && !roles.includes(role ?? "")) {
        throw new Error("Non autorisé")
    }
    return session
}
