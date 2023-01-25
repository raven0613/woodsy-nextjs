import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import useSWR, { Key, Fetcher } from 'swr'
import useSWRMutation from 'swr/mutation'
import Navbar from '../../components/navbar'
import { Iarticle, Icomment, Iuser, param } from '../home'
import CommentCard from "../../components/commentCard"
import CommentInput from "../../components/commentInput"
import { getArticle } from '../../api_helpers/apis/article'
import { getComments, addComments } from '../../api_helpers/apis/comments'
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
    const [comment, setComment] = useState<Icomment | null>(null)
    const [comments, setComments] = useState<Icomment[]>([])

    const router = useRouter()
    const { id } = router.query
    // fetch 全部回覆
    const { data: commentsData, error: commentsError } = useSWR([`article/${id}/comments`, params], ([url, params]) => fetchComments(url, params));
    

    const { data: articleData, error: articleError } = useSWR(id, fetchArticle);
    const article: Iarticle = articleData? articleData.data : {}
    
    // 新增一條回覆
    const { trigger, isMutating, data: addedCommentData, error: addedCommentsError } = useSWRMutation<Icomment, Error>(`comment`, fetchAddComments);




    useEffect(() => {
        const comments: Icomment[] = commentsData? commentsData.data : []
        setComments(comments)
    }, [commentsData])


    function handleAddComment (comment: Icomment) {
        trigger(comment)
        setComments([...comments, comment])
    }

    return (
        <>
            <Navbar />
            {article && <div className='h-screen mx-2 w-full md:mx-auto md:w-4/5 lg:w-3/5 flex flex-col justify-between pb-8'>

                <div className='pt-20 flex-1'>
                    <h1 className='text-2xl font-semibold '>{article.title}</h1>
                    <article className='whitespace-pre-wrap'>{article.content}</article>
                    
                    <div className='w-full'>
                        {comments && comments.map(comment => {
                            return (
                                <CommentCard comment={comment} key={comment.id}/>
                            )
                        })}
                    </div>
                </div>

                <CommentInput handleAddComment={handleAddComment} currentUser={currentUser} />
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

type arg = {
    arg: Icomment
}

async function fetchAddComments (url: string, { arg }: arg) {
    try {
        const { data } = await addComments(url, arg)
        return data
    } catch (err) {
        console.log(err)
    }
}

