import { NextAuthOptions } from "next-auth"
import GithubProviders from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export const authOptions: NextAuthOptions = {
    providers: [
        GithubProviders({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
        CredentialsProvider({
            name: "Identifiants",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Mot de passe", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null
                const user = await prisma.user.findUnique({ where: { email: credentials.email } })
                if (!user) return null
                const isValid = await bcrypt.compare(credentials.password, user.password)
                if (!isValid) return null
                return { id: user.id, name: user.name, email: user.email, image: user.image, role: user.role }
            },
        }),
    ],
    session: { strategy: "jwt" },
    pages: { signIn: "/login" },
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === "github" && user.email) {
                await prisma.user.upsert({
                    where: { email: user.email },
                    update: { name: user.name ?? undefined, image: user.image ?? undefined },
                    create: {
                        email: user.email,
                        name: user.name ?? null,
                        image: user.image ?? null,
                        password: "",
                        role: "user",
                    },
                })
            }
            return true
        },
        async jwt({ token, user }) {
            const t = token as typeof token & { role?: string }
            const u = user as { role?: string } | undefined
            if (u) t.role = u.role ?? "user"
            return t
        },
        async session({ session, token }) {
            const t = token as typeof token & { role?: string }
            if (session.user) (session.user as typeof session.user & { role?: string }).role = t.role
            return session
        },
    },
}
