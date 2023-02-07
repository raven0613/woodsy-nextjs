import { Iarticle, ICollection, successResult } from '../type-config'

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
