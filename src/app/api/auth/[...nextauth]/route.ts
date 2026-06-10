import NextAuth from "next-auth"
import GithubProviders from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

const handler = NextAuth({
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

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                })
                if (!user) return null

                const isValid = await bcrypt.compare(credentials.password, user.password)
                if (!isValid) return null

                const result = { id: user.id, name: user.name, email: user.email, image: user.image, role: user.role }
                return result
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    callbacks: {
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
})

export { handler as GET, handler as POST }