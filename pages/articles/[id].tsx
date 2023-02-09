import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import useSWR, { Key, Fetcher } from 'swr'
import useSWRMutation from 'swr/mutation'
import Navbar from '../../components/navbar'
import { Iarticle, Icomment, Iuser, param, commentArg, articleArg, deleteArg, successResult } from '../../type-config'
import CommentCardController from "../../components/comment/commentCardController"
import CommentInput from "../../components/comment/commentInput"
import ArticleCardController from '../../components/article/articleCardController'

import { fetchArticle, fetchEditArticle, fetchDeleteArticle, fetchComments, fetchAddComments, fetchEditComments, fetchDeleteComments } from '../../api_helpers/fetchers'
import { formattedArticles, formattedComments } from '../../helpers/helpers'
import Link from 'next/link'
import hollowStyle from '../../styles/hollow.module.css';
import { useSession } from 'next-auth/react'
import useArticleRecord from '../../components/hooks/useArticleRecord'
import { articleContext, UIContext } from '../../components/ArticleProvider'
import { useContext, useRef } from 'react'

const params: param = { page: 1, limit: 15 }

export default function Article () {
    const { currentArticleId, handleIdChange, refetchTrigger, handleRefetchTrigger } = useContext(articleContext)
    const { handleConfirmWindow, handleEditWindow } = useContext(UIContext)

    const { data: session, status } = useSession()

    const currentUser: Iuser = session? { ...session.user } : {
        name: '', email: '', account: '', role: ''
    }
    const currentUserId = currentUser.id
    
    const [moreShowingId, setMoreShowingId] = useState<string>('')
    
    const router = useRouter()
    const { id } = router.query

    //fetch 回來的文章資料
    const [comments, setComments] = useState<Icomment[]>([])
    const [article, setArticle] = useState<Iarticle | null>()

    // 抓取一篇文章
    const { trigger: artTrigger, data: artData, error: artError } = useSWRMutation<successResult, Error>(`article/${id}`, fetchArticle);

    // 得到該文章的所有回覆
    const { trigger: commentsTrigger, data: commentsData, error: commentsError } = useSWRMutation([`article/${id}/comments`, params], ([url, params]) => fetchComments(url, params));

    // 喜歡和收藏的 fetch hook
    const { artRecordTrigger, getRecordIsMutating } = useArticleRecord({onSuccessCallback})


    function onSuccessCallback (data: successResult) {
        artTrigger()
        commentsTrigger()
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
    // 存進 article
    useEffect(() => {
        if (!currentUserId || !artData) return
        const payload = artData.payload as Iarticle
        const art = formattedArticles(currentUserId as number, [payload] as Iarticle[])[0]
        setArticle(art)
    }, [artData, currentUserId])
    //存進 comments
    useEffect(() => {
        if (!currentUserId || !commentsData) return
        const payload = commentsData? commentsData.data.payload.rows : []
        const com = formattedComments(currentUserId as number, payload as Icomment[])
        setComments(com)
    }, [commentsData, currentUserId])
    
    // 新增一條回覆
    const { trigger: addComTrigger, isMutating: addComIsMutating, data: addedComData, error: addedComError } = useSWRMutation<successResult, Error>(`comment`, fetchAddComments, {onSuccess: onSuccessCallback});
    // 刪除一條回覆
    const { trigger: deleteComTrigger, isMutating: deleteComIsMutating, data: deletedComData, error: deletedComError } = useSWRMutation<successResult, Error>(`comment`, fetchDeleteComments, {onSuccess: onSuccessCallback});
    // 編輯一條回覆
    const { trigger: editComTrigger, isMutating: editComIsMutating, data: editComData, error: editComError } = useSWRMutation<Icomment, Error>(`comment`, fetchEditComments);
    


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
    // function handleDeleteComment (commentId: number) {
    //     // const updatedData = comments.filter(com => com.id !== commentId)
    //     // setComments(updatedData)
    //     deleteComTrigger(commentId)
    // }

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
        // currentArticleIdRef.current = articleId

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
        // currentArticleIdRef.current = articleId

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
            {article && <div className='h-screen mx-2 w-full flex flex-col justify-between pb-8'>

                <div className='pt-20 flex-1'>

                    <div className='flex items-center'>
                        <h2 className='text-lg font-semibold px-4'>{article.User?.name}</h2>
                        {article.Hollow && <Link className={hollowStyle.hollow_button} href={`/hollows/${article.Hollow.id}`}><p>{article.Hollow.name}</p></Link>}
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