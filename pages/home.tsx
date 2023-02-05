import { useEffect, useState } from 'react'
import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation'
import HollowCard from '../components/hollow/hollowCard'
import ArticleCard from '../components/article/articleCard'
import ArticleInput from '../components/article/articleInput'
import ToTopButton from '../components/toTopButton'
import HollowCreatePanel from "../components/hollow/hollowCreatePanel"
import { getHollows } from '../api_helpers/apis/hollow'
import { fetchUserLike, fetchDeleteUserLike, fetchUserCollect, fetchDeleteUserCollect, fetchUser, fetchHotHollows, fetchHotArticles, fetchArticle, fetchAddArt, fetchEditArticle, fetchDeleteArticle } from '../api_helpers/fetchers'
import { type } from 'os';
import { Iuser, Ihollow, Iarticle, Icomment, param, serverProps,  articleArg, deleteArg, successResult, likePayload, paramArg, rows } from '../type-config';
import { getCsrfToken, getSession, useSession } from 'next-auth/react';
import { CtxOrReq } from 'next-auth/client/_utils';
import { formattedArticles } from '../helpers/helpers'

const inter = Inter({ subsets: ['latin'] })

const arg = { page: 1, limit: 10 }

export default function Home({ articleCounts, articleRows, hollowCounts, hollowRows, csrfToken }: serverProps) {
    const { data: session, status } = useSession()

    const currentUser: Iuser = session? { ...session.user } : {
        name: '', email: '', account: '', role: ''
    }
    const currentUserId = currentUser.id

    const [moreShowingId, setMoreShowingId] = useState<string>('')


    // 抓取一包文章
    const { trigger: hotArtTrigger, data: hotArtData, error: hotArtError } = useSWRMutation<successResult, Error>(`article`, fetchHotArticles);
    // 新增一則文章
    const { trigger: addArtTrigger, isMutating: addArtIsMutating, data: addedArtData, error: addedArtError } = useSWRMutation<successResult, Error>(`article`, fetchAddArt);
    // 刪除一篇文章
    const { trigger: deleteArtTrigger, isMutating: deleteArtIsMutating, data: deletedArtData, error: deletedArtError } = useSWRMutation<Iarticle, Error>(`article`, fetchDeleteArticle);
    // 新增喜歡
    const { trigger: addLikeTrigger, isMutating: addLikeIsMutating, data: addLikeData, error: addLikeError } = useSWRMutation<successResult, Error>(`likeRecord`, fetchUserLike);
    // 移除喜歡
    const { trigger: deleteLikeTrigger, isMutating: deleteLikeIsMutating, data: deleteLikeData, error: deleteLikeError } = useSWRMutation<successResult, Error>(`likeRecord`, fetchDeleteUserLike);
    // 新增收藏
    const { trigger: addCollectTrigger, isMutating: addCollectIsMutating, data: addCollectData, error: addCollectError } = useSWRMutation<successResult, Error>(`collectionRecord`, fetchUserCollect);
    // 移除收藏
    const { trigger: deleteCollectTrigger, isMutating: deleteCollectIsMutating, data: deleteCollectData, error: deleteCollectError } = useSWRMutation<successResult, Error>(`collectionRecord`, fetchDeleteUserCollect);


    const [articles, setArticles] = useState<Iarticle[]>([])
    const [hollows, setHollows] = useState<Ihollow[]>([])
    // const [newArticle, setNewArticle] = useState<Iarticle | null>(null)
    const newArticle = addedArtData?.payload as Iarticle
    
    useEffect(() => {
        if (!currentUserId) return
        console.log(articleRows)
        const hotHollows: Ihollow[] = hollowRows? hollowRows : []
        const hotArticles: Iarticle[] = articleRows? articleRows : []
        const arts = formattedArticles(currentUserId, hotArticles)
        setHollows(hotHollows)
        setArticles(arts)
    }, [articleRows, hollowRows, currentUserId])

    useEffect(() => {
        if (!currentUserId) return
        if (!hotArtData) return
        const artRows = hotArtData?.payload as rows
        const artDatas: Iarticle[] = artRows.rows
        const arts = formattedArticles(currentUserId, artDatas)
        setArticles(arts)
    }, [currentUserId, hotArtData])

    function handleAddArt (article: Iarticle) {
        addArtTrigger(article)
    }
    function handleDeleteArt (articleId: number) {
        deleteArtTrigger(articleId)
    }
    function handleAddHollow (hollow: Ihollow) {
        setHollows([...hollows, hollow])
    }
    function handleClickMore (artId: string) {
        setMoreShowingId(artId)
    }
    function handleCloseMore () {
        setMoreShowingId('')
    }
    function handleLike (articleId: number, isLiked: boolean) {
        if (!currentUserId) return console.log('請先登入')
        const payload = { user_id: currentUserId, article_id: articleId }
        if (isLiked) {
            deleteLikeTrigger(payload)
        } else {
            addLikeTrigger(payload)
        }
    }
    function handleCollect (articleId: number, isCollected: boolean) {
        if (!currentUser) return console.log('請先登入')
        const payload = { user_id: currentUserId, article_id: articleId }
        if (isCollected) {
            deleteCollectTrigger(payload)
        } else {
            addCollectTrigger(payload)
        }
    }

    // 按讚成功就重新 fetch API
    const addLikeSuccessData = addLikeData?.payload || null
    const addCollectSuccessData = addCollectData?.payload || null
    useEffect(() => {
        hotArtTrigger(arg)
    }, [addLikeSuccessData, deleteLikeData, addCollectSuccessData, deleteCollectData, hotArtTrigger])

    return (
    <main className='w-full md:mx-auto md:w-4/5 lg:w-6/12'>
        <div className='hidden sm:block mt-20 mx-2 w-full'>
            {csrfToken && <ArticleInput 
            hollows={hollows} 
            currentUser={currentUser} 
            handleAddArt={handleAddArt}/>}

            {/* <HollowCreatePanel 
            currentUser={currentUser} 
            hollows={hollows} 
            handleAddHollow={handleAddHollow}/> */}
        </div>

        <div className='pt-6 mx-2 w-full'>
            <div className='flex justify-between'>
                <h1 className='text-slate-300 text-xl font-semibold'>大家關心的樹洞</h1>
                <Link href={`/hollows`}>
                    <span>查看所有樹洞</span>
                </Link>
            </div>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                {hollows && hollows.map(hollow => {
                    return (
                        <Link href={`/hollows/${hollow.id}`} key={hollow.id}>
                            <HollowCard hollow={hollow}/>
                        </Link>
                    )
                })}
            </div>
        </div>  
        
        <div className='pt-6 mx-2 w-full'>
            <h1 className='text-slate-300 text-xl font-semibold'>大家關心的話題</h1>
            <div className='flex-col justify-center w-full'>
                {newArticle && <ArticleCard article={newArticle} key={newArticle.id} 
                    handleCollect={handleCollect}
                    handleLike={handleLike}
                    handleClickMore={handleClickMore}
                    handleCloseMore={handleCloseMore}
                    handleDeleteArt={handleDeleteArt}
                    moreShowingId={moreShowingId} 
                    currentUser={currentUser}/>}

                {articles && articles.map(art => {
                return (
                    <ArticleCard article={art} key={art.id} 
                    handleCollect={handleCollect}
                    handleLike={handleLike}
                    handleClickMore={handleClickMore}
                    handleCloseMore={handleCloseMore}
                    handleDeleteArt={handleDeleteArt}
                    moreShowingId={moreShowingId} 
                    currentUser={currentUser}/>
                )
                })}
            </div>
        </div>
    </main>
    )
}

export async function getServerSideProps(context: CtxOrReq | undefined) {
    const arg = { page: 1, limit: 10 }
    const params = { page: 1, limit: 10 }
    try {
        const [articles, hollows] = await Promise.all([
            fetchHotArticles('article', { arg }),
            fetchHotHollows('hollow', params)
        ])
        const { count: articleCounts, rows: articleRows } = articles?.payload
        const { count: hollowCounts, rows: hollowRows } = hollows?.data.payload
        const csrfToken = await getCsrfToken(context)
        return {
            props: { articleCounts, articleRows, hollowCounts, hollowRows, csrfToken }
        }
    } catch (err) {
        console.log(err)
    }
}
