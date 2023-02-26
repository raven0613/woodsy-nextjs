import { useRouter } from 'next/router'
import { useState, useEffect, useContext, useRef } from 'react'
import useSWR, { Key, Fetcher } from 'swr'
import useSWRMutation from 'swr/mutation'
import Navbar from '../../components/navbar'
import { Iarticle, Icomment, Iuser, param, commentArg, articleArg, deleteArg, successResult, ICollection, ILikeship } from '../../type-config'
import CommentCardController from "../../components/comment/commentCardController"
import CommentInput from "../../components/comment/commentInput"
import ArticleCardController from '../../components/article/articleCardController'

import { fetchArticle, fetchEditArticle, fetchDeleteArticle, fetchComments, fetchComment, fetchAddComments, fetchEditComments, fetchDeleteComments } from '../../api_helpers/fetchers'
import { formattedArticles, formattedComments } from '../../helpers/helpers'
import Link from 'next/link'
import hollowStyle from '../../styles/hollow.module.css';
import useArticleRecord from '../../components/hooks/useArticleRecord'
import { articleContext, UIContext } from '../../components/ArticleProvider'
import { userContext } from '../../components/UserProvider'
import randomstring from 'randomstring'

const params: param = { page: 1, limit: 15, keyword: '' }
const randomMap = new Map()  // userId: tempId
const commentMap = new Map()

export default function Article () {
    const { currentUser, handleSetCurrentUser } = useContext(userContext)
    const { currentArticleId, handleIdChange, refetchTrigger, handleRefetchTrigger } = useContext(articleContext)
    const { handleConfirmWindow, handleEditWindow } = useContext(UIContext)

    const currentUserId = currentUser?.id
    
    const [moreShowingId, setMoreShowingId] = useState<string>('')
    
    const router = useRouter()
    const { id } = router.query

    //fetch 回來的文章資料
    const [comments, setComments] = useState<Icomment[]>([])
    const [article, setArticle] = useState<Iarticle | null>()
    const currentCommentIdRef = useRef<number>()

    // 抓取一篇文章
    const { trigger: artTrigger, data: artData, error: artError } = useSWRMutation<successResult, Error>(`article/${id}`, fetchArticle);

    // 得到該文章的所有回覆
    const { trigger: commentsTrigger, data: commentsData, error: commentsError } = useSWRMutation([`article/${id}/comments`, params], ([url, params]) => fetchComments(url, params));

    // 抓取一個回覆
    const { trigger: commentTrigger, data: commentData, error: commentError } = useSWRMutation<successResult, Error>(`comment/${currentCommentIdRef.current}`, fetchComment);
    // 新增一條回覆
    const { trigger: addComTrigger, isMutating: addComIsMutating, data: addedComData, error: addedComError } = useSWRMutation<successResult, Error>(`comment`, fetchAddComments, {onSuccess: onComRecordSuccess});
    // 刪除一條回覆
    const { trigger: deleteComTrigger, isMutating: deleteComIsMutating, data: deletedComData, error: deletedComError } = useSWRMutation<successResult, Error>(`comment`, fetchDeleteComments, {onSuccess: onComRecordSuccess});
    // 編輯一條回覆
    const { trigger: editComTrigger, isMutating: editComIsMutating, data: editComData, error: editComError } = useSWRMutation<Icomment, Error>(`comment`, fetchEditComments);

    // 喜歡和收藏的 fetch hook
    const { artRecordTrigger, getRecordIsMutating } = useArticleRecord({onArtRecordSuccess})

    // 新增 & 刪除回覆成功
    function onComRecordSuccess (data: successResult) {
        const payload = data.payload as Icomment
        commentsTrigger()
        setComments(coms => [...coms, payload])
    }
    // 按讚 & 收藏成功
    function onArtRecordSuccess (data: successResult) {
        const { article_id, comment_id } = data.payload as ICollection | ILikeship
        if (article_id) {
            artTrigger() 
        }
        else if (comment_id) {
            commentTrigger() 
        }
    }

    useEffect(() => {
        if (!id || !artTrigger || !commentsTrigger) return
        artTrigger()
        commentsTrigger()
    }, [id, artTrigger, commentsTrigger])

    // 刪除後要重新 fetch
    useEffect(() => {
        if (!refetchTrigger) return
        artTrigger()
        commentsTrigger()
        return () => {
            handleRefetchTrigger && handleRefetchTrigger()
        }
    }, [refetchTrigger, handleRefetchTrigger, artTrigger, commentsTrigger])

    // 抓回來一篇的文章資料
    useEffect(() => {
        if (!currentUserId || !artData) return
        const payload = artData.payload as Iarticle
        const art = formattedArticles(currentUserId as number, [payload] as Iarticle[])[0]
        setArticle(art)
    }, [artData, currentUserId])

    // 抓回來一整包的回覆資料
    useEffect(() => {
        if (!currentUserId || !commentsData) return
        const payload = commentsData? commentsData.data.payload.rows : []
        const coms = formattedComments(currentUserId as number, payload as Icomment[])
        const comsWithTempId = coms.map(com => {
            let tempId = ''
            if (com.user_id === currentUserId) {
                tempId = '原PO'
                randomMap.set(com.user_id, tempId)
            }
            if (!randomMap.get(com.user_id)) {
                tempId = randomstring.generate(5)
                randomMap.set(com.user_id, tempId)
            }
            else {
                tempId = randomMap.get(com.user_id)
            }
            return { ...com, User: {...com.User, tempId} }
        }) as Icomment[]

        for (let item in comsWithTempId) {
            if (!commentMap.get(comsWithTempId[item].id)) {
                commentMap.set(comsWithTempId[item].id, 1)
            }
        }
        setComments(comsWithTempId)
    }, [commentsData, currentUserId])

    // 抓回來一篇的回覆資料
    useEffect(() => {
        if (!currentUserId || !commentData) return
        const payload = commentData.payload as Icomment
        let com = formattedComments(currentUserId as number, [payload] as Icomment[])[0]
        if (!com.User) return
        com = {...com, User: {...com.User, tempId: randomMap.get(com.user_id)}}
        if (commentMap.get(com.id)) {
            return setComments(comments => {
                return comments.map(comment => {
                    if (com.id === comment.id) {
                        return com
                    }
                    return comment;
                });
            })
        }
    }, [currentUserId, commentData])

    // 新增一條回覆
    function handleAddComment (comment: Icomment) {
        addComTrigger(comment)
        setComments([...comments, comment])
    }
    // 確認編輯回覆
    function handleSubmitComment (comment: Icomment) {
        const newComments = comments.map(com => {
            if (com.id === comment.id) {
                return { ...com, content: comment.content}
            }
            return { ...com }
        })
        setComments(newComments)
        editComTrigger(comment)
    }

    // 當 user 按下小視窗內的刪除按鈕
    function handleClickDelete () {
        if (!handleIdChange || !handleConfirmWindow) return
        handleConfirmWindow()
        setMoreShowingId('')
    }

    function handleClickMore (id: string) {
        console.log(id)
        if (!id || !handleIdChange) return
        setMoreShowingId(id)
        handleIdChange(id)
    }
    function handleCloseMore () {
        setMoreShowingId('')
    }

    function handleLike (articleId: number, commentId: number, isLiked: boolean) {
        if (getRecordIsMutating('like') || getRecordIsMutating('deleteLike')) return
        if (!currentUserId) return console.log('請先登入')
        currentCommentIdRef.current = commentId

        const payload = articleId ? 
        { user_id: currentUserId, article_id: articleId }
        : { user_id: currentUserId, comment_id: commentId }

        if (isLiked) {
            artRecordTrigger('deleteLike', payload)
        } else {
            artRecordTrigger('like', payload)
        }
    }
    function handleCollect (articleId: number, isCollected: boolean) {
        if (getRecordIsMutating('collect') || getRecordIsMutating('deleteCollect')) return
        if (!currentUserId) return console.log('請先登入')

        const payload = { user_id: currentUserId, article_id: articleId }
        if (isCollected) {
            artRecordTrigger('deleteCollect', payload)
        } else {
            artRecordTrigger('collect', payload)
        }
    }
    function handleEdit (article: Iarticle) {
        if (!article || !handleEditWindow) return
        handleEditWindow(article)
    }
    return (
        <main className='md:mx-auto md:w-4/5 lg:w-6/12'>
            {article && <div className='h-auto mx-2 w-full flex flex-col justify-between pb-8'>

                <div className='pt-20 flex-1'>

                    <div className='flex items-center'>
                        <h2 className='text-lg font-semibold px-4'>{article.User?.name}</h2>
                        {article.Hollow && <Link className={hollowStyle.hollow_button} href={`/hollows/${article.Hollow.id}`}>
                            <p>{article.Hollow.name}</p>
                        </Link>}
                    </div>

                    <ArticleCardController article={article}
                    handleCollect={handleCollect}
                    handleLike={handleLike}
                    handleClickMore={handleClickMore}
                    handleCloseMore={handleCloseMore}
                    handleClickDelete={handleClickDelete}
                    moreShowingId={moreShowingId} 
                    currentUser={currentUser}
                    handleEdit={handleEdit}
                    isDetail={true} />
                    
                    <div className='w-full'>
                        {comments && comments.map(comment => {
                            return (
                                <CommentCardController 
                                comment={comment}
                                key={comment.id}
                                handleClickDelete={handleClickDelete}
                                handleSubmitComment={handleSubmitComment}
                                handleClickMore={handleClickMore}
                                moreShowingId={moreShowingId}
                                handleCloseMore={handleCloseMore}
                                handleLike={handleLike} />
                            )
                        })}
                    </div>
                </div>

                <CommentInput handleAddComment={handleAddComment} currentUser={currentUser} article={article} />
            </div>}

        </main>
    )
}