import type { Adapter } from "next-auth/adapters"
import { JWT } from "next-auth/jwt"

import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import EmailProvider from "next-auth/providers/email"

export const authOptions = {
    session: {
        strategy: "jwt",
        jwt: true,
    },
    providers: [
        EmailProvider({
            server: process.env.EMAIL_SERVER,
            from: process.env.EMAIL_FROM,
            // maxAge: 24 * 60 * 60, // How long email links are valid for (default 24h)
            type: 'email'
        })
        // ...add more providers here
    ],
}

export default NextAuth(authOptions)