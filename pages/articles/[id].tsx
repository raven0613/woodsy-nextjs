import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import useSWR, { Key, Fetcher } from 'swr'
import useSWRMutation from 'swr/mutation'
import Navbar from '../../components/navbar'
import { Iarticle, Icomment, Iuser, param, commentArg, articleArg, deleteArg, successResult } from '../../type-config'
import CommentCard from "../../components/comment/commentCard"
import CommentInput from "../../components/comment/commentInput"
import ArticleDetailCard from "../../components/article/articleDetailCard"
import ArticleCardController from '../../components/article/articleCardController'

import { fetchArticle, fetchEditArticle, fetchDeleteArticle, fetchComments, fetchAddComments, fetchEditComments, fetchDeleteComments } from '../../api_helpers/fetchers'
import { AxiosResponse } from 'axios'
import { formattedArticles } from '../../helpers/helpers'
import Link from 'next/link'
import hollowStyle from '../../styles/hollow.module.css';
import { useSession } from 'next-auth/react'
import useArticleReord from '../../components/hooks/useArticleReord'
import { articleContext, UIContext } from '../../components/ArticleProvider'
import { useContext, useRef } from 'react'

const params: param = { page: 1, limit: 15 }

export default function Article () {
    const { currentArticleId, handleArticleIdChange, refetchTrigger, handleRefetchTrigger } = useContext(articleContext)
    const { handleConfirmWindow, handleEditWindow } = useContext(UIContext)

    const { data: session, status } = useSession()

    const currentUser: Iuser = session? { ...session.user } : {
        name: '', email: '', account: '', role: ''
    }
    const currentUserId = currentUser.id
    
    const [moreShowingId, setMoreShowingId] = useState<string>('')
    
    const router = useRouter()
    const { id } = router.query
    // 抓取一篇文章
    const { trigger: artTrigger, data: artData, error: artError } = useSWRMutation<successResult, Error>(`article/${id}`, fetchArticle);

    //fetch 回來的文章資料
    const [comments, setComments] = useState<Icomment[]>([])
    const [article, setArticle] = useState<Iarticle | null>()

    useEffect(() => {
        if (!id || !artTrigger) return
        artTrigger()
    }, [id, artTrigger])

    // 喜歡和收藏的 fetch hook
    const { artRecordTrigger, getRecordIsMutating } = useArticleReord({onSuccessCallback})
    function onSuccessCallback (data: successResult) {
        //重新 fetch
        artTrigger()
    }


    // 得到該樹洞的所有回覆
    const { data: commentsData, error: commentsError } = useSWR([`article/${id}/comments`, params], ([url, params]) => fetchComments(url, params));
    
    useEffect(() => {
        if (!currentUserId || !artData) return
        const payload = artData.payload as Iarticle
        const art = formattedArticles(currentUserId as number, [payload] as Iarticle[])[0]
        setArticle(art)
    }, [artData, currentUserId])

    
    // 新增一條回覆
    const { trigger: addComTrigger, isMutating: addComIsMutating, data: addedComData, error: addedComError } = useSWRMutation<Icomment, Error>(`comment`, fetchAddComments);
    // 刪除一條回覆
    const { trigger: deleteComTrigger, isMutating: deleteComIsMutating, data: deletedComData, error: deletedComError } = useSWRMutation<Icomment, Error>(`comment`, fetchDeleteComments);
    // 編輯一條回覆
    const { trigger: editComTrigger, isMutating: editComIsMutating, data: editComData, error: editComError } = useSWRMutation<Icomment, Error>(`comment`, fetchEditComments);
    // 刪除一篇文章
    const { trigger: deleteArtTrigger, isMutating: deleteArtIsMutating, data: deletedArtData, error: deletedArtError } = useSWRMutation<Iarticle, Error>(`article`, fetchDeleteArticle);
    
    useEffect(() => {
        const fetchedComments: Icomment[] = commentsData? commentsData.data.payload.rows : []
        setComments(fetchedComments)
    }, [commentsData])



    function handleAddComment (comment: Icomment) {
        addComTrigger(comment)
        setComments([...comments, comment])
    }
    function handleEditComment (comment: Icomment) {
        const newComments = comments.map(com => {
            if (com.id === comment.id) {
                return { ...com, content: comment.content}
            }
            return { ...com }
        })
        setComments(newComments)
        editComTrigger(comment)
    }
    function handleDeleteComment (commentId: number) {
        const updatedData = comments.filter(com => com.id !== commentId)
        setComments(updatedData)
        deleteComTrigger(commentId)
    }

    // 當 user 按下小視窗內的刪除按鈕
    function handleClickDelete () {
        if (!handleArticleIdChange || !handleConfirmWindow) return
        handleConfirmWindow()
        setMoreShowingId('')
    }

    function handleClickMore (id: string) {
        setMoreShowingId(id)
    }
    function handleCloseMore () {
        setMoreShowingId('')
    }

    function handleLike (articleId: number, isLiked: boolean) {
        if (getRecordIsMutating('like') || getRecordIsMutating('deleteLike')) return console.log('別吵還在處理')
        if (!currentUserId) return console.log('請先登入')
        // currentArticleIdRef.current = articleId

        if (!handleArticleIdChange) return
        handleArticleIdChange(articleId)

        const payload = { user_id: currentUserId, article_id: articleId }
        if (isLiked) {
            artRecordTrigger('deleteLike', payload)
        } else {
            artRecordTrigger('like', payload)
        }
    }
    function handleCollect (articleId: number, isCollected: boolean) {
        if (getRecordIsMutating('collect') || getRecordIsMutating('deleteCollect')) return console.log('別吵還在處理')
        if (!currentUserId) return console.log('請先登入')
        // currentArticleIdRef.current = articleId

        if (!handleArticleIdChange) return
        handleArticleIdChange(articleId)

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
                                <CommentCard 
                                comment={comment}
                                key={comment.id}
                                handleDeleteComment={handleDeleteComment}
                                handleEditComment={handleEditComment}
                                handleClickMore={handleClickMore}
                                moreShowingId={moreShowingId}
                                handleCloseMore={handleCloseMore}/>
                            )
                        })}
                    </div>
                </div>

                <CommentInput handleAddComment={handleAddComment} currentUser={currentUser} />
                {/* <ArticleEditWindow article={article}/> */}
            </div>}

        </main>
    )
}