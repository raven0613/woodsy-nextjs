import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import useSWR, { Key, Fetcher } from 'swr'
import useSWRMutation from 'swr/mutation'
import Navbar from '../../components/navbar'
import { Iarticle, Icomment, Iuser, param, commentArg, articleArg, deleteArg } from '../../type-config'
import CommentCard from "../../components/comment/commentCard"
import CommentInput from "../../components/comment/commentInput"
import ArticleDetailCard from "../../components/article/articleDetailCard"
import ArticleEditWindow from "../../components/article//articleEditWindow"
import { getArticle, editArticle, deleteArticle } from '../../api_helpers/apis/article'
import { getComments, addComment, editComment, deleteComment } from '../../api_helpers/apis/comments'
import { AxiosResponse } from 'axios'
import { articlesWithHollowName } from '../home'
import Link from 'next/link'

const currentUser: Iuser = {
    id: 1,
    name: '白文鳥',
    account: 'abc123',
    articles: 5,
    subHollows: 2,
    createAt: '20230106',
    role: 'user',
    email: '',
    password: ''
}

const params: param = { page: 1, limit: 15 }

export default function Article () {
    const [moreShowingId, setMoreShowingId] = useState<string>('')
    
    const router = useRouter()
    const { id } = router.query
    const { data: articleData, error: articleError } = useSWR(id, fetchArticle);
    //fetch 回來的文章資料
    const [comments, setComments] = useState<Icomment[]>([])
    const [article, setArticle] = useState<Iarticle | null>()


    // fetch 全部回覆
    const { data: commentsData, error: commentsError } = useSWR([`article/${id}/comments`, params], ([url, params]) => fetchComments(url, params));
    
    useEffect(() => {
        const fetchedArt: Iarticle = articleData? articleData.data : {}
        // const art = articlesWithHollowName()
        setArticle(fetchedArt)
    }, [articleData])

    
    // 新增一條回覆
    const { trigger: addComTrigger, isMutating: addComIsMutating, data: addedComData, error: addedComError } = useSWRMutation<Icomment, Error>(`comment`, fetchAddComments);
    // 刪除一條回覆
    const { trigger: deleteComTrigger, isMutating: deleteComIsMutating, data: deletedComData, error: deletedComError } = useSWRMutation<Icomment, Error>(`comment`, fetchDeleteComments);
    // 編輯一條回覆
    const { trigger: editComTrigger, isMutating: editComIsMutating, data: editComData, error: editComError } = useSWRMutation<Icomment, Error>(`comment`, fetchEditComments);
    // 刪除一篇文章
    const { trigger: deleteArtTrigger, isMutating: deleteArtIsMutating, data: deletedArtData, error: deletedArtError } = useSWRMutation<Iarticle, Error>(`article`, fetchDeleteArticle);
    
    useEffect(() => {
        const comments: Icomment[] = commentsData? commentsData.data : []
        setComments(comments)
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

    function handleDeleteArt (articleId: number) {
        deleteArtTrigger(articleId)
        router.push('/home')
    }
    function handleClickMore (id: string) {
        setMoreShowingId(id)
    }
    function handleCloseMore () {
        setMoreShowingId('')
    }
    return (
        <main className='md:mx-auto md:w-4/5 lg:w-6/12'>
            {article && <div className='h-screen mx-2 w-full flex flex-col justify-between pb-8'>

                <div className='pt-20 flex-1'>

                    <div className='flex items-center'>
                        <h2 className='text-lg font-semibold px-4'>{article.User?.name}</h2>
                        {article.Hollow && <Link className='' href={`/hollows/${article.Hollow.id}`}>{article.Hollow.name}</Link>}
                    </div>

                    <ArticleDetailCard article={article} 
                    handleDeleteArt={handleDeleteArt} 
                    handleClickMore={handleClickMore}
                    moreShowingId={moreShowingId}
                    handleCloseMore={handleCloseMore} />
                    
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

async function fetchArticle (id: string) {
    try {
        const res = await getArticle(id)
        return res
    } catch (err) {
        console.log(err)
    }
}

async function fetchComments (url: string, { page, limit }: param) {
    try {
        const res = await getComments(url, page, limit)
        return res
    } catch (err) {
        console.log(err)
    }
}



async function fetchAddComments (url: string, { arg }: commentArg) {
    try {
        const { data } = await addComment(url, arg)
        return data
    } catch (err) {
        console.log(err)
    }
}

async function fetchEditComments (url: string, { arg }: commentArg) {
    try {
        const { data } = await editComment(url, arg)
        return data
    } catch (err) {
        console.log(err)
    }
}

async function fetchDeleteComments (url: string, { arg }: deleteArg) {
    try {
        const { data } = await deleteComment(url, arg)
        return data
    } catch (err) {
        console.log(err)
    }
}

async function fetchEditArticle (url: string, { arg }: articleArg) {
    try {
        const { data } = await editArticle(url, arg)
        return data
    } catch (err) {
        console.log(err)
    }
}

async function fetchDeleteArticle (url: string, { arg }: deleteArg) {
    try {
        
        const { data } = await deleteArticle(url, arg)
        return data
    } catch (err) {
        console.log(err)
    }
}