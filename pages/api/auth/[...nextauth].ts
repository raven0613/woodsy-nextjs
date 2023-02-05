import type { Adapter, AdapterUser } from "next-auth/adapters"
import { JWT, getToken } from "next-auth/jwt"


import NextAuth, { Session, User, DefaultSession  } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import EmailProvider from "next-auth/providers/email"
import CredentialsProvider from "next-auth/providers/credentials"


import { userRegister, userLogin } from '../../../api_helpers/apis/user'
import { ILoginuser } from "../../../type-config"

export default NextAuth({
    session: {
        strategy: "jwt",
    },
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: 'emailAndPassword',
            credentials: {
                account: {
                    label: 'account',
                    type: 'account',
                    placeholder: 'jsmith',
                },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials, req) {  //確認授權的邏輯
                const payload: ILoginuser = {
                    account: credentials?.account || '',
                    password: credentials?.password || '',
                }
                const res = await userLogin('/auth/signin', payload)

                const user = res.data
                // 如果登入資訊正確   .statusText === 'ok'
                if (res.status === 200 && user) {
                    return user   // 例如 { name: 'J Smith', email: 'jsmith@example.com' }
                }
                return null
            }
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async jwt({ token, user, account }) {
            if (account) {
                return {
                    accessToken: account.access_token,
                    refreshToken: account.refresh_token,
                    ...user
                }
            }
            return token
        },
        async session({ session, token }) {
            const userJSON = JSON.parse(JSON.stringify(token.payload))
            const { id, name, account, email, role } = userJSON
            session.user = { id, name, account, email, role }
            session.accessToken = token.accessToken

            return session
        }
    },
    debug: true
})


