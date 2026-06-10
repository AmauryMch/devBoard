import bcrypt from "bcryptjs"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
    const password = await bcrypt.hash("password123", 10)

    await prisma.user.upsert({
        where: { email: "admin@devboard.local" },
        update: { role: "admin" },
        create: {
            name: "Admin",
            email: "admin@devboard.local",
            password,
            role: "admin",
        },
    })

    await prisma.user.upsert({
        where: { email: "user@devboard.local" },
        update: { role: "user" },
        create: {
            name: "User",
            email: "user@devboard.local",
            password,
            role: "user",
        },
    })

    console.log("Comptes de demo prets (mot de passe: password123) ->")
    console.log("  admin@devboard.local (role: admin)")
    console.log("  user@devboard.local (role: user)")
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
