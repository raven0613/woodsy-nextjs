import { useEffect, useState, useContext, useRef } from 'react'
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
import { fetchUserLike, fetchDeleteUserLike, fetchUserCollect, fetchDeleteUserCollect, fetchUser, fetchAddHollow, fetchHotHollows, fetchHotArticles, fetchArticle, fetchAddArt, fetchEditArticle, fetchDeleteArticle } from '../api_helpers/fetchers'
import { type } from 'os';
import { Iuser, Ihollow, Iarticle, Icomment, param, serverProps,  articleArg, deleteArg, successResult, likePayload, paramArg, rows, IArticleContext, ILikeship, ICollection, subPayload } from '../type-config';
import { getCsrfToken } from 'next-auth/react';
import { CtxOrReq } from 'next-auth/client/_utils';
import { formattedArticles, formattedHollows } from '../helpers/helpers'

import { articleContext, UIContext } from '../components/ArticleProvider'
import { userContext } from '../components/UserProvider'

import useArticleRecord from '../components/hooks/useArticleRecord'
import useHollowRecord from '../components/hooks/useHollowRecord';

const inter = Inter({ subsets: ['latin'] })

const arg = { page: 1, limit: 10 }

export default function Home({ articleCounts, articleRows, hollowCounts, hollowRows, csrfToken }: serverProps) {
    const { currentUser } = useContext(userContext)
    const { currentArticleId, handleIdChange, refetchTrigger, handleRefetchTrigger } = useContext(articleContext)
    const { handleConfirmWindow, handleEditWindow } = useContext(UIContext)

    const currentUserId = currentUser?.id
    const [moreShowingId, setMoreShowingId] = useState<string>('')
    const [newArticle, setNewArticle] = useState<Iarticle>()
    const [articles, setArticles] = useState<Iarticle[]>([])
    const [hollows, setHollows] = useState<Ihollow[]>([])

    // 抓取一包文章
    const { trigger: hotArtTrigger, data: hotArtData, error: hotArtError } = useSWRMutation<successResult, Error>(`article`, fetchHotArticles);
    // 抓取一包樹洞
    const { trigger: hotHollowTrigger, data: hotHollowData, error: hotHollowError } = useSWRMutation<successResult, Error>(`hollow`, fetchHotHollows);
    // 抓取一篇文章
    const { trigger: artTrigger, data: artData, error: artError } = useSWRMutation<successResult, Error>(`article/${currentArticleId}`, fetchArticle);
    // 新增一則文章
    const { trigger: addArtTrigger, isMutating: addArtIsMutating, data: addedArtData, error: addedArtError } = useSWRMutation<successResult, Error>(`article`, fetchAddArt, { onSuccess: (data: successResult) => { 
        const payload = data.payload as Iarticle
        const art = formattedArticles(currentUserId as number, [payload] as Iarticle[])[0]
        setNewArticle(art)
    }});
    // 新增一個樹洞
    const { trigger: addHollowTrigger, isMutating: addHollowIsMutating, data: addedHollowData, error: addedHollowError } = useSWRMutation<successResult, Error>(`hollow`, fetchAddHollow, { onSuccess: (data: successResult) => { 
        // const payload = data.payload as Ihollow
        hotHollowTrigger(arg)
    }});
    // 喜歡和收藏的 fetch hook
    const { artRecordTrigger, getRecordIsMutating } = useArticleRecord({onSuccessCallback})
    // 關注的 fetch hook
    const { hollowRecordTrigger, getHollowRecordIsMutating } = useHollowRecord({onSuccessCallback})

    const currentArticleIdRef = useRef<number>()

    function onSuccessCallback (data: successResult) {
        // 按讚之後 newArt 會被蓋掉
        // const { article_id } = data.payload as ICollection
        // // console.log('newArticle', newArticle)
        // // console.log('article_id', article_id)
        // // console.log('currentArticleIdRef.current', currentArticleIdRef.current)
        // if (article_id === currentArticleIdRef.current) {
        //     // return artTrigger()
        // }  //TODO: 新增文章的邏輯還沒調整好
        hotArtTrigger(arg)
        hotHollowTrigger(arg)
    }
    // server props 的文章樹洞資料
    useEffect(() => {
        if (!currentUserId) return
        const hotHollows: Ihollow[] = hollowRows? hollowRows : []
        const hotArticles: Iarticle[] = articleRows? articleRows : []
        const arts = formattedArticles(currentUserId, hotArticles)
        const hollows = formattedHollows(currentUserId, hotHollows)
        setHollows(hollows)
        setArticles(arts)
    }, [articleRows, hollowRows, currentUserId])
    // 抓回來一整包的文章資料
    useEffect(() => {
        if (!currentUserId) return
        if (!hotArtData) return
        const artRows = hotArtData?.payload as rows
        const artDatas = artRows.rows as Iarticle[]
        const arts = formattedArticles(currentUserId, artDatas)
        setArticles(arts)
    }, [currentUserId, hotArtData])
    // 抓回來一整包的樹洞資料
    useEffect(() => {
        if (!currentUserId) return
        if (!hotHollowData) return
        const hollowRows = hotHollowData?.payload as rows
        const hollowDatas = hollowRows.rows as Ihollow[]
        const hollows = formattedHollows(currentUserId, hollowDatas)
        setHollows(hollows)
    }, [currentUserId, hotHollowData])
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
        addHollowTrigger(hollow)
    }
    function handleClickMore (artId: string) {
        if (!artId || !handleIdChange) return
        setMoreShowingId(artId)
        handleIdChange(artId)
    }
    function handleCloseMore () {
        if (!handleIdChange) return
        setMoreShowingId('')
        handleIdChange('')
    }
    // 當 user 按下小視窗內的刪除按鈕
    function handleClickDelete () {
        if (!handleIdChange || !handleConfirmWindow) return
        handleConfirmWindow()
        setMoreShowingId('')
    }
    function handleLike (articleId: number, _commentId: number, isLiked: boolean) {
        if (getRecordIsMutating('like') || getRecordIsMutating('deleteLike')) return
        if (!currentUserId) return console.log('請先登入')
        currentArticleIdRef.current = articleId

        const payload = { user_id: currentUserId, article_id: articleId }
        if (isLiked) {
            artRecordTrigger('deleteLike', payload)
        } else {
            artRecordTrigger('like', payload)
        }
    }
    function handleCollect (articleId: number, isCollected: boolean) {
        if (getRecordIsMutating('collect') || getRecordIsMutating('deleteCollect')) return
        if (!currentUserId) return console.log('請先登入')
        currentArticleIdRef.current = articleId

        const payload = { user_id: currentUserId, article_id: articleId }
        if (isCollected) {
            artRecordTrigger('deleteCollect', payload)
        } else {
            artRecordTrigger('collect', payload)
        }
    }
    function handleSub (hollowId: number, isSub: boolean) {
        if (!currentUserId) return
        if (getHollowRecordIsMutating('sub') || getHollowRecordIsMutating('deleteSub')) return

        const payload: subPayload = { user_id: currentUserId, hollow_id: hollowId }
        if (isSub) {
            hollowRecordTrigger('deleteSub', payload)
        }
        else {
            hollowRecordTrigger('sub', payload)
        }
    }
    function handleEdit (article: Iarticle) {
        if (!article || !handleEditWindow) return
        handleEditWindow(article)
    }
    return (
        <main className='w-full md:mx-auto md:w-4/5 lg:w-6/12'>
            <div className='hidden sm:block mt-20 mx-2 w-full'>
                {currentUser && csrfToken && <ArticleInput 
                hollows={hollows} 
                currentUser={currentUser} 
                handleAddArt={handleAddArt}/>}

                {currentUser && csrfToken && <HollowCreatePanel 
                currentUser={currentUser} 
                hollows={hollows} 
                handleAddHollow={handleAddHollow}/>}
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
                                <HollowCard hollow={hollow} handleSub={handleSub} />
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

export async function getServerSideProps(context: CtxOrReq) {
    try {
        const [articles, hollows] = await Promise.all([
            fetchHotArticles('article', { arg }),
            fetchHotHollows('hollow', { arg })
        ])
        const { count: articleCounts, rows: articleRows } = articles?.payload
        const { count: hollowCounts, rows: hollowRows } = hollows?.payload
        const csrfToken = await getCsrfToken(context)
        return {
            props: { articleCounts, articleRows, hollowCounts, hollowRows, csrfToken }
        }
    } catch (err) {
        console.log(err)
    }
}
