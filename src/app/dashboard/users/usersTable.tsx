"use client"

import { useState } from "react"

type User = {
    id: string
    name: string | null
    email: string
    role: string
    createdAt: Date
}

type Props = {
    users: User[]
}

export function UsersTable({ users }: Props) {
    const [shouldThrow, setShouldThrow] = useState(false)

    if (shouldThrow) {
        throw new Error('Erreur de test depuis le dashboard')
    }

    return (
        <div>
            {users.length === 0 ? (
                <div className="py-16 text-center border border-dashed border-zinc-800 rounded">
                    <p className="text-zinc-500 text-sm">Aucun utilisateur trouvé.</p>
                </div>
            ) : (
                <div className="overflow-x-auto border border-zinc-800 rounded">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-zinc-900 text-zinc-400 uppercase text-xs tracking-widest">
                                <th className="px-4 py-3 text-left font-medium">Nom</th>
                                <th className="px-4 py-3 text-left font-medium">Email</th>
                                <th className="px-4 py-3 text-left font-medium">Rôle</th>
                                <th className="px-4 py-3 text-left font-medium">Inscrit le</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="border-t border-zinc-800 hover:bg-zinc-900/60 transition-colors">
                                    <td className="px-4 py-3 text-white">{user.name ?? "—"}</td>
                                    <td className="px-4 py-3 text-zinc-400">{user.email}</td>
                                    <td className="px-4 py-3">
                                        <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-[0.15em] border border-zinc-700 px-2 py-0.5 rounded-sm">
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-zinc-600">
                                        {new Date(user.createdAt).toLocaleDateString("fr-FR", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <br />

            <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => setShouldThrow(true)}
            >
                Provoquer une erreur
            </button>
        </div>
    )
}
