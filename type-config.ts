import NextAuth, { DefaultSession } from "next-auth"
import { type } from "os"
import { ReactNode } from "react"


export interface Iuser {
    id?: number
    name: string
    email: string
    password?: string
    account: string
    articleCounts?: number
    subHollows?: number
    createdAt?: string
    updatedAt?: string
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
    articleCounts: number
    isSub?: boolean
    subCounts: number
    createdAt?: string
    userId?: number
    user_id?: number
};

export interface Iarticle {
    id?: number
    title: string
    hollow_id: number
    user_id: number
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
    User?: user
    Hollow?: hollow
    CollectedUsers?: user[]
    LikedUsers?: user[]
    UserId?: number
    HollowId?: number
};

interface user {
    id: number
    name: string
}
interface hollow {
    id: number
    name: string
}


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
    User?: user
}

export interface ISubcription {
    id: number
    userId: number
    hollowId: number
    createdAt: string
}
export interface ICollection {
    id: number
    userId: number
    articleId: number
    createdAt: string
};
export interface ILikeship {
    id: number
    userId: number
    articleId: number
    commentId: number
    createdAt: string
};

export interface IReport {
    id: number
    userId: number
    hollowId: number
    articleId: number
    commentId: number
    createdAt: string
};

export interface param {
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
      role: string
    } & DefaultSession["user"]
  }
}

export interface errorMessage {
    error: string
}

export interface successMessage {
    success: string
    payload?: Iuser | Iuser[] | Iarticle | Iarticle[] | Ihollow | Ihollow[] | Icomment | Icomment[] | ICollection | ILikeship | IReport | ISubcription
}