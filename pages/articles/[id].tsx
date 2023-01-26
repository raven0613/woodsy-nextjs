import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import useSWR, { Key, Fetcher } from 'swr'
import useSWRMutation from 'swr/mutation'
import Navbar from '../../components/navbar'
import { Iarticle, Icomment, Iuser, param } from '../home'
import CommentCard from "../../components/comment/commentCard"
import CommentInput from "../../components/comment/commentInput"
import ArticleDetailCard from "../../components/article/articleDetailCard"
import ArticleEditWindow from "../../components/article//articleEditWindow"
import { getArticle, editArticle, deleteArticle } from '../../api_helpers/apis/article'
import { getComments, addComment, editComment, deleteComment } from '../../api_helpers/apis/comments'
import { AxiosResponse } from 'axios'

const currentUser: Iuser = {
    id: 'u1',
    name: '白文鳥',
    account: 'abc123',
    articles: 5,
    subHollows: 2,
    createAt: '20230106',
    role: 'user'
}

const params: param = { page: 1, limit: 15 }

export default function Article () {
    const router = useRouter()
    const { id } = router.query
    const { data: articleData, error: articleError } = useSWR(id, fetchArticle);
    //fetch 回來的文章資料
    

    const [comments, setComments] = useState<Icomment[]>([])
    const [article, setArticle] = useState<Iarticle | null>()


    // fetch 全部回覆
    const { data: commentsData, error: commentsError } = useSWR([`article/${id}/comments`, params], ([url, params]) => fetchComments(url, params));
    


    
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

    useEffect(() => {
        const fetchedArt: Iarticle = articleData? articleData.data : {}
        setArticle(fetchedArt)
    }, [articleData])

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
    function handleDeleteComment (commentId: string) {
        const updatedData = comments.filter(com => com.id !== commentId)
        setComments(updatedData)
        deleteComTrigger(commentId)
    }

    function handleDeleteArt (articleId: string) {
        deleteArtTrigger(articleId)
        router.push('/home')
    }
    return (
        <>
            {article && <div className='h-screen mx-2 w-full md:mx-auto md:w-4/5 lg:w-3/5 flex flex-col justify-between pb-8'>

                <div className='pt-20 flex-1'>
                    <ArticleDetailCard article={article} handleDeleteArt={handleDeleteArt} />
                    
                    <div className='w-full'>
                        {comments && comments.map(comment => {
                            return (
                                <CommentCard 
                                comment={comment}
                                key={comment.id}
                                handleDeleteComment={handleDeleteComment}
                                handleEditComment={handleEditComment}/>
                            )
                        })}
                    </div>
                </div>

                <CommentInput handleAddComment={handleAddComment} currentUser={currentUser} />
                <ArticleEditWindow article={article}/>
            </div>}

        </>
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

type commentArg = {
    arg: Icomment
}
type articleArg = {
    arg: Iarticle
}
type deleteArg = {
    arg: string
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