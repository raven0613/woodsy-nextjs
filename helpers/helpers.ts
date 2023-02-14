import { Iarticle, ICollection, Icomment, Ihollow, successResult } from '../type-config'
type SetState = React.SetStateAction<any>

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

export const formattedHollows = (currentUserId: number, hollows: Ihollow[]): Ihollow[] => {

    return hollows.map(hollow => {
        const isSub = hollow.SubUsers?.some((user: { id: number }) => user.id === currentUserId)
        // result 為整理過格式的版本
        const { SubUsers, UserId, ...result } = hollow
        return { ...result, isSub}
    })
}



export function emailCheck (email: string, setWarning: SetState, setCantSubmit: () => void) {
    const msg = 'x e-mail 格式不正確'
    let at: number = 0
    let dot:number = 0
    let firstQuote = null
    let lastQuote = null
    const special = ' (),:;<>[\]'
    for (let i = 0; i < email.length; i++) {
        switch(email[i]) {
            case '@': {   // 不可超過一個 @
                if (at !== 0) return rejectSubmit(msg, setWarning, setCantSubmit)
                at = i
                break
            }
            case '.': {   // 頭尾不可為 . 不可連續兩個 .
                dot = i
                if (i - dot === 1) return rejectSubmit(msg, setWarning, setCantSubmit)
                if (i === 0 || i === email.length - 1) return rejectSubmit(msg, setWarning, setCantSubmit)
                break
            }
            case '_': {
                if (at > 0 && i > at) return rejectSubmit(msg, setWarning, setCantSubmit)  // 域名不可有 _
                break
            }
            case '"': {   // 如果 @ 前有 "" 就把位置記起來
                if (!firstQuote) {   
                    firstQuote = i
                } 
                else if (firstQuote && at === 0) { lastQuote = i }
                else {
                    return rejectSubmit(msg, setWarning, setCantSubmit)   // " 不可以在 @ 後面出現
                }
            }
            default: {
                break
            }
        }
        if (special.includes(email[i])) {
            if (firstQuote === null || lastQuote && i > lastQuote) return rejectSubmit(msg, setWarning, setCantSubmit)   // 空格和其他特殊符號只能在 "" 裡面出現
        }
    }
    if (firstQuote && lastQuote) {   // 如果有 "" 但是 "" 的外圍沒有被 . 包圍（"" 需要自己是完整一區）
        if (firstQuote > 1 && email[firstQuote - 1] !== '.' || lastQuote < at - 1 && email[lastQuote + 1] !== '.') return rejectSubmit(msg, setWarning, setCantSubmit)
    }
    if (at === 0) {  // 不可沒有 @
        return rejectSubmit(msg, setWarning, setCantSubmit)
    }
    if (email.slice(0, at).length > 64) {  // 域內部分不可超過64字
        return rejectSubmit(msg, setWarning, setCantSubmit)
    }
}

function rejectSubmit (msg: string, setWarning: SetState, setCantSubmit: () => void) {
    setCantSubmit()
    setWarning(msg)
}

export function passWordCheck (password: string, setWarning: SetState, setCantSubmit: () => void) {
    const msg = 'x 密碼格式不正確'
    if (password.length < 8) return rejectSubmit(msg, setWarning, setCantSubmit)
    let en = false
    let num = false
    const pattern = /[a-zA-Z0-9]/
    const enPattern = /[a-zA-Z]/
    const numPattern = /[0-9]/
    if (!password.match(pattern)) return rejectSubmit(msg, setWarning, setCantSubmit)
    for (let i = 0; i < password.length; i++) {
        if (password.match(enPattern)) {
            en = true
        }
        if (password.match(numPattern)) {
            num = true
        }
    }
    if (!en || !num) return rejectSubmit(msg, setWarning, setCantSubmit)
}