import NextAuth from "next-auth";
import GithubProviders from "next-auth/providers/github";


const handler = NextAuth({
    providers: [
        GithubProviders({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
    ],

})

export { handler as GET, handler as POST }
