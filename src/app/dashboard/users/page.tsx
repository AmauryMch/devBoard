import { prisma } from "@/lib/prisma"
import { UsersTable } from "./usersTable"

export default async function UsersPage() {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
        },
        orderBy: { createdAt: "desc" },
    })

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-xl font-bold tracking-widest uppercase text-white">Utilisateurs</h1>
                <p className="text-zinc-500 text-xs mt-1 tracking-wide">
                    {users.length} utilisateur{users.length !== 1 ? "s" : ""} enregistré{users.length !== 1 ? "s" : ""}
                </p>
            </div>

            <UsersTable users={users} />
        </div>
    )
}
