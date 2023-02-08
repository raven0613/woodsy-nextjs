import { useEffect, useState } from 'react'
import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation'
import HollowCard from '../components/hollow/hollowCard'
import ArticleCardController from '../components/article/articleCardController'
import ArticleInput from '../components/article/articleInput'
import ToTopButton from '../components/toTopButton'
import HollowCreatePanel from "../components/hollow/hollowCreatePanel"
import { getHollows } from '../api_helpers/apis/hollow'
import { fetchUserLike, fetchDeleteUserLike, fetchUserCollect, fetchDeleteUserCollect, fetchUser, fetchHotHollows, fetchHotArticles, fetchArticle, fetchAddArt, fetchEditArticle, fetchDeleteArticle } from '../api_helpers/fetchers'
import { type } from 'os';
import { Iuser, Ihollow, Iarticle, Icomment, param, serverProps,  articleArg, deleteArg, successResult, likePayload, paramArg, rows, IArticleContext, ILikeship, ICollection } from '../type-config';
import { getCsrfToken, getSession, useSession } from 'next-auth/react';
import { CtxOrReq } from 'next-auth/client/_utils';
import { formattedArticles } from '../helpers/helpers'

import { articleContext, UIContext } from '../components/ArticleProvider'
import { useContext, useRef } from 'react'

import useArticleReord from '../components/hooks/useArticleReord'

const inter = Inter({ subsets: ['latin'] })

const arg = { page: 1, limit: 10 }

export default function Home({ articleCounts, articleRows, hollowCounts, hollowRows, csrfToken }: serverProps) {
    const { currentArticleId, handleArticleIdChange, refetchTrigger, handleRefetchTrigger } = useContext(articleContext)
    const { handleConfirmWindow, handleEditWindow } = useContext(UIContext)

    const { data: session, status } = useSession()
    const currentUser: Iuser = session? { ...session.user } : {
        id: 0, name: '', email: '', account: '', role: ''
    }
    const currentUserId = currentUser.id
    const [moreShowingId, setMoreShowingId] = useState<string>('')
    const [newArticle, setNewArticle] = useState<Iarticle>()
    const [articles, setArticles] = useState<Iarticle[]>([])
    const [hollows, setHollows] = useState<Ihollow[]>([])

    // 抓取一包文章
    const { trigger: hotArtTrigger, data: hotArtData, error: hotArtError } = useSWRMutation<successResult, Error>(`article`, fetchHotArticles);
    // 抓取一篇文章
    const { trigger: artTrigger, data: artData, error: artError } = useSWRMutation<successResult, Error>(`article/${currentArticleId}`, fetchArticle);
    // 新增一則文章
    const { trigger: addArtTrigger, isMutating: addArtIsMutating, data: addedArtData, error: addedArtError } = useSWRMutation<successResult, Error>(`article`, fetchAddArt, { onSuccess: (data: successResult) => { 
        const payload = data.payload as Iarticle
        const art = formattedArticles(currentUserId as number, [payload] as Iarticle[])[0]
        setNewArticle(art)
    }});
    // 喜歡和收藏的 fetch hook
    const { artRecordTrigger, getRecordIsMutating } = useArticleReord({onSuccessCallback})


    const currentArticleIdRef = useRef<number>()

    function onSuccessCallback (data: successResult) {
        // 按讚之後 newArt 會被蓋掉
        const { article_id } = data.payload as ICollection
        // console.log('newArticle', newArticle)
        // console.log('article_id', article_id)
        // console.log('currentArticleIdRef.current', currentArticleIdRef.current)
        if (article_id === currentArticleIdRef.current) {
            // return artTrigger()
        }  //TODO: 新增文章的邏輯還沒調整好
        hotArtTrigger(arg)
    }
    // server props 的文章樹洞資料
    useEffect(() => {
        if (!currentUserId) return
        const hotHollows: Ihollow[] = hollowRows? hollowRows : []
        const hotArticles: Iarticle[] = articleRows? articleRows : []
        const arts = formattedArticles(currentUserId, hotArticles)
        setHollows(hotHollows)
        setArticles(arts)
    }, [articleRows, hollowRows, currentUserId])
    // 抓回來一整包的文章樹洞資料
    useEffect(() => {
        if (!currentUserId) return
        if (!hotArtData) return
        const artRows = hotArtData?.payload as rows
        const artDatas: Iarticle[] = artRows.rows
        const arts = formattedArticles(currentUserId, artDatas)
        setArticles(arts)
    }, [currentUserId, hotArtData])
    // 抓回來一篇的文章資料
    useEffect(() => {
        if (!currentUserId) return
        if (!artData) return
        const payload = artData.payload as Iarticle
        if (currentArticleIdRef.current !== payload.id) return
        const art = formattedArticles(currentUserId as number, [payload] as Iarticle[])[0]
        setNewArticle(art)
    }, [currentUserId, artData])
    
    // 刪除文章後重新 fetch API
    useEffect(() => {
        if (!refetchTrigger) return
        hotArtTrigger(arg)
        return () => {
            handleRefetchTrigger && handleRefetchTrigger()
        }
    }, [refetchTrigger, hotArtTrigger, handleRefetchTrigger])

    // useEffect(() => {
    //     if (!refetchTrigger) return
    //     artTrigger()
    // }, [refetchTrigger, artTrigger])


    function handleAddArt (article: Iarticle) {
        addArtTrigger(article)
    }
    function handleAddHollow (hollow: Ihollow) {
        setHollows([...hollows, hollow])
    }
    function handleClickMore (artId: string) {
        if (!artId || !handleArticleIdChange) return
        setMoreShowingId(artId)
        handleArticleIdChange(Number(artId.slice(1)))
    }
    function handleCloseMore () {
        if (!handleArticleIdChange) return
        setMoreShowingId('')
        handleArticleIdChange(0)
    }
    // 當 user 按下小視窗內的刪除按鈕
    function handleClickDelete () {
        if (!handleArticleIdChange || !handleConfirmWindow) return
        handleConfirmWindow()
        setMoreShowingId('')
    }
    function handleLike (articleId: number, _commentId: number, isLiked: boolean) {
        if (getRecordIsMutating('like') || getRecordIsMutating('deleteLike')) return console.log('別吵還在處理')
        if (!currentUserId) return console.log('請先登入')
        currentArticleIdRef.current = articleId

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
        currentArticleIdRef.current = articleId

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
                {newArticle && <ArticleCardController 
                    article={newArticle} key={newArticle.id} 
                    handleCollect={handleCollect}
                    handleLike={handleLike}
                    handleClickMore={handleClickMore}
                    handleCloseMore={handleCloseMore}
                    handleClickDelete={handleClickDelete}
                    moreShowingId={moreShowingId} 
                    currentUser={currentUser}
                    handleEdit={handleEdit}
                    isDetail={false} />}

                {articles && articles.map(art => {
                return (
                    <ArticleCardController article={art} key={art.id} 
                    handleCollect={handleCollect}
                    handleLike={handleLike}
                    handleClickMore={handleClickMore}
                    handleCloseMore={handleCloseMore}
                    handleClickDelete={handleClickDelete}
                    moreShowingId={moreShowingId} 
                    currentUser={currentUser}
                    handleEdit={handleEdit}
                    isDetail={false} />
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
