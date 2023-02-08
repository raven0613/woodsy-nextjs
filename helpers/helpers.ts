import { Iarticle, ICollection, Icomment, successResult } from '../type-config'

export const formattedArticles = (currentUserId: number, articles: Iarticle[]): Iarticle[] => {
    return articles.map(article => {
        const isCollected = article.CollectedUsers?.some((user: { id: number }) => user.id === currentUserId)
        const isLiked = article.LikedUsers?.some((user: { id: number }) => user.id === currentUserId)
        const des = article.content.length < 200? article.content : article.content.trim().slice(0, 200) + '...'

        const likedCounts = article.LikedUsers?.length || 0
        const collectedCounts = article.CollectedUsers?.length || 0
        
        // result 為整理過格式的版本
        const { CollectedUsers, LikedUsers, UserId, HollowId, ...result } = article
        return { ...result, description: des, isCollected, isLiked, likedCounts, collectedCounts}
    })
}

export const formattedComments = (currentUserId: number, comments: Icomment[]): Icomment[] => {
    return comments.map(comment => {
        // console.log(comment)
        const isLiked = comment.LikedUsers?.some((user: { id: number }) => user.id === currentUserId)
        const des = comment.content?.length < 200? comment.content : comment.content.trim().slice(0, 200) + '...'
        // result 為整理過格式的版本
        const { LikedUsers, UserId, ArticleId, ...result } = comment
        return { ...result, description: des, isLiked}
    })
}