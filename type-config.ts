import NextAuth, { DefaultSession } from "next-auth"
import { ReactNode } from "react"


export interface Iuser {
    id?: number
    name: string
    email: string
    password: string
    account: string
    articles: number
    subHollows: number
    createAt?: string
    role: string
}; 
export interface ILoginuser{
    account: string
    password: string
}; 

export interface Ihollow {
    id?: number,
    name: string,
    type: string,
    userId: number,
    article: number,
    isSub: boolean,
    subCounts: number,
    createdAt: string,
};

export interface Iarticle {
    id?: number
    title: string
    hollowId: number
    userId: number
    content: string
    commentCounts: number
    collectedCounts: number
    likedCounts: number
    reportedCounts: number
    isCollected?: boolean
    isLiked?: boolean
    reportedAt?: string
    createdAt?: string
    hollowName?: string
    description?: string
    comments?: ReactNode
};

export interface Icomment {
    id: number
    articleId: number
    userId: number
    content: string
    likedCounts: number
    reportedCounts: number
    isLiked: boolean
    reportedAt: string
    createdAt: string
    description?: string
};
export type param = {
    page: number
    limit: number
}

export type serverProps = {
    articleCounts: number
    hollowCounts: number
    articleRows: Iarticle[]
    hollowRows: Ihollow[]
    csrfToken: string
}
export type userArg = {
    arg: Iuser
}
export type userLoginArg = {
    arg: Iuser
}
export type commentArg = {
    arg: Icomment
}
export type articleArg = {
    arg: Iarticle
}
export type deleteArg = {
    arg: string
}


declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    accessToken: string | unknown
    user: {
      /** The user's postal address. */
      id: number
      name: string
      account: string
      email: string
    } & DefaultSession["user"]
  }
}
