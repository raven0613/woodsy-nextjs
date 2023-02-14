import NextAuth, { DefaultSession } from "next-auth"
import { type } from "os"
import { ReactNode } from "react"
import { Articles } from "./models"


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
    email: string
    password: string
}; 

export interface Ihollow {
    id?: number,
    name: string,
    type: string,
    articleCounts?: number
    subCounts?: number
    isSub?: boolean
    createdAt?: string
    userId?: number
    user_id?: number
    UserId?: number
    SubUsers?: user[]
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
    id?: number
    article_id: number
    user_id: number
    content: string
    likedCounts: number
    reportedCounts: number
    isLiked?: boolean
    reportedAt?: string
    createdAt?: string
    description?: string
    User?: user
    LikedUsers?: user[]
    UserId?: number
    ArticleId?: number
}

export interface ISubcription {
    id: number
    userId: number
    hollowId: number
    createdAt: string
}
export interface ICollection {
    article_id: number | undefined
    id: number
    user_id: number
    comment_id: number
    createdAt: string
};
export interface ILikeship {
    article_id: number | undefined
    id: number
    user_id: number
    comment_id: number
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

export interface userSubPayload {
    id: number
    name: number
    SubHollows: Ihollow[]
}

export interface subPayload {
    user_id: number
    hollow_id: number
}
export interface collectionPayload {
    user_id: number
    article_id: number
}
export interface likePayload {
    user_id: number
    article_id?: number
    comment_id?: number
}

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
export type hollowArg = {
    arg: Ihollow
}
export type deleteArg = {
    arg: string
}
export type payloadArg = {
    arg: likePayload | collectionPayload | subPayload
}
export type paramArg = {
    arg: param
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
      email: string
      role: string
    } & DefaultSession["user"]
  }
}


export interface errorResult {
    error: string
}

export interface successResult {
    success: string
    payload?: Iuser | Iuser[] | Iarticle | Iarticle[] | Ihollow | Ihollow[] | Icomment | Icomment[] | ICollection | ILikeship | IReport | userSubPayload | rows
}


export interface rows {
    count: number
    rows: Iarticle[] | Icomment[] | Ihollow[]
}


export interface IArticleContext {
    currentArticleId?: number
    currentCommentId?: number
    handleIdChange?: (id: string) => void
//   handleArticleReFetch?: (trigger: () => void) => void
    refetchTrigger?: boolean 
    handleRefetchTrigger?: () => void
    
}

export interface IUIContext {
    handleConfirmWindow?: () => void
    handleEditWindow?: (article: Iarticle) => void
}