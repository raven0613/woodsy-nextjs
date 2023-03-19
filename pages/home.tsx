import { useEffect, useState, useContext, useRef } from 'react'
import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import useSWRMutation from 'swr/mutation'
import HollowCard from '../components/hollow/hollowCard'
import ArticleCardController from '../components/article/articleCardController'
import ArticleInput from '../components/article/articleInput'
import HollowCreatePanel from "../components/hollow/hollowCreatePanel"
import { fetchUserLike, fetchDeleteUserLike, fetchUserCollect, fetchDeleteUserCollect, fetchUser, fetchHollow, fetchAddHollow, fetchHotHollows, fetchHotArticles, fetchArticle, fetchAddArt, fetchEditArticle, fetchDeleteArticle } from '../api_helpers/fetchers'
import { type } from 'os';
import { Iuser, Ihollow, Iarticle, Icomment, param, serverProps,  articleArg, deleteArg, successResult, likePayload, paramArg, rows, IArticleContext, ILikeship, ICollection, subPayload } from '../type-config';
import { getCsrfToken } from 'next-auth/react';
import { CtxOrReq } from 'next-auth/client/_utils';
import { formattedArticles, formattedHollows } from '../helpers/helpers'

import { articleContext, UIContext } from '../components/ArticleProvider'
import { userContext } from '../components/UserProvider'
import { VariableSizeList as List } from 'react-window';

import useArticleRecord from '../components/hooks/useArticleRecord'
import useHollowRecord from '../components/hooks/useHollowRecord';
import useThrottle from '../components/hooks/useThrottle';
import { useRecoilValue } from 'recoil'
import { currentUserState } from '../store/user'


const inter = Inter({ subsets: ['latin'] })

const arg = { page: 1, limit: 10, keyword: '' }
const keyArg = { page: 1, limit: 10, keyword: '' }
const artMap = new Map()
const newArtMap = new Map()

export default function Home({ articleCounts, articleRows, hollowCounts, hollowRows, csrfToken, total }: serverProps) {
    // const { currentUser } = useContext(userContext)
    const currentUser = useRecoilValue(currentUserState)
    const { handleIdChange, refetchTrigger, handleRefetchTrigger } = useContext(articleContext)
    const { handleConfirmWindow, handleEditWindow } = useContext(UIContext)

    const currentUserId = currentUser?.id
    const [moreShowingId, setMoreShowingId] = useState<string>('')
    const [newArticles, setNewArticles] = useState<Iarticle[]>([])
    const [articles, setArticles] = useState<Iarticle[]>([])
    const [hollows, setHollows] = useState<Ihollow[]>([])
    const [keyHollows, setKeyHollows] = useState<Ihollow[]>([])
    const [isHollowPanelOpen, setIsHollowPanelOpen] = useState<boolean>(false)
    const [page, setPage] = useState<number>(2)
    const currentArticleIdRef = useRef<number>()

    // 抓取一包文章
    const { trigger: hotArtTrigger, data: hotArtData, error: hotArtError, isMutating: hotArtIsMutating } = useSWRMutation<successResult, Error>(`article`, fetchHotArticles);
    // 抓取一包樹洞
    const { trigger: hotHollowTrigger, data: hotHollowData, error: hotHollowError } = useSWRMutation<successResult, Error>(`hollow`, fetchHotHollows);
    // 抓取一包關鍵字樹洞
    const { trigger: keyHollowTrigger, data: keyHollowData, error: keyHollowError } = useSWRMutation<successResult, Error>(`hollow`, fetchHotHollows, {
        onSuccess: (data: successResult) => {
            const { rows } = data.payload as rows
            setKeyHollows(rows as Ihollow[])
        }
    });
    // 抓取一篇文章
    const { trigger: artTrigger, data: artData, error: artError } = useSWRMutation<successResult, Error>(`article/${currentArticleIdRef.current}`, fetchArticle);
    // 新增一則文章
    const { trigger: addArtTrigger, isMutating: addArtIsMutating, data: addedArtData, error: addedArtError } = useSWRMutation<successResult, Error>(`article`, fetchAddArt, { onSuccess: (data: successResult) => { 
        const payload = data.payload as Iarticle
        const art = formattedArticles(currentUserId as number, [payload] as Iarticle[])[0]
        setNewArticles(arts => [art, ...arts])
        if (!newArtMap.get(art.id)) {
            newArtMap.set(art.id, 1)
        }
    }});
    // 新增一個樹洞
    const { trigger: addHollowTrigger, isMutating: addHollowIsMutating, data: addedHollowData, error: addedHollowError } = useSWRMutation<successResult, Error>(`hollow`, fetchAddHollow, { onSuccess: (data: successResult) => { 
        // const payload = data.payload as Ihollow
        hotHollowTrigger(arg)
    }});
    // 喜歡和收藏的 fetch hook
    const { artRecordTrigger, getRecordIsMutating } = useArticleRecord({onArtRecordSuccess})
    // 關注的 fetch hook
    const { hollowRecordTrigger, getHollowRecordIsMutating } = useHollowRecord({onSuccessCallback})

    const artSize = articles.length
    useThrottle({hotArtTrigger, page, setPage, artSize, total})

    function onSuccessCallback (data: successResult) {
        hotHollowTrigger(arg)
    }
    function onArtRecordSuccess (data: successResult) {
        const { article_id } = data.payload as ICollection | ILikeship
        if (!article_id) return
        artTrigger()
    }
    // server props 的文章樹洞資料
    useEffect(() => {
        newArtMap.clear()
        artMap.clear()
        setPage(2)
        if (!currentUserId) return
        const hotHollows: Ihollow[] = hollowRows? hollowRows : []
        const hotArticles: Iarticle[] = articleRows? articleRows : []
        const arts = formattedArticles(currentUserId, hotArticles)
        const noRepeatArts = []
        for (let item in arts) {
            if (!artMap.get(arts[item].id)) {
                artMap.set(arts[item].id, 1)
                noRepeatArts.push(arts[item])
            }
        }
        const hollows = formattedHollows(currentUserId, hotHollows)
        setHollows(hollows)
        setArticles(noRepeatArts)
    }, [articleRows, hollowRows, currentUserId])
    // 抓回來一整包的文章資料
    useEffect(() => {
        if (!currentUserId || !hotArtData) return
        const artRows = hotArtData?.payload as rows
        const artDatas = artRows.rows as Iarticle[]
        const arts = formattedArticles(currentUserId, artDatas)
        const noRepeatArts: Iarticle[] = []
        for (let item in arts) {
            if (!artMap.get(arts[item].id)) {
                artMap.set(arts[item].id, 1)
                noRepeatArts.push(arts[item])
            }
        }
        setArticles(articles => [...articles, ...noRepeatArts])
    }, [currentUserId, hotArtData])
    // 抓回來一整包的樹洞資料
    useEffect(() => {
        if (!currentUserId || !hotHollowData) return
        const hollowRows = hotHollowData?.payload as rows
        const hollowDatas = hollowRows.rows as Ihollow[]
        const hollows = formattedHollows(currentUserId, hollowDatas)
        setHollows(hollows)
    }, [currentUserId, hotHollowData])
    // 抓回來一篇的文章資料
    useEffect(() => {
        if (!currentUserId || !artData) return
        const payload = artData.payload as Iarticle
        if (currentArticleIdRef.current !== payload.id) return
        const art = formattedArticles(currentUserId as number, [payload] as Iarticle[])[0]
        // 按讚的是在熱門文章列表中
        if (artMap.get(art.id)) {
            return setArticles(arts => {
                return arts.map(article => {
                    if (article.id === art.id) {
                        return art;
                    }
                    return article;
                });
            })
        }
        // 按讚的是在新文章列表中
        setNewArticles(arts => {
            return arts.map(article => {
                if (article.id === art.id) {
                    return art;
                }
                return article;
            });
        })
    }, [currentUserId, artData])
    
    // 刪除文章後重新 fetch API
    useEffect(() => {
        if (!refetchTrigger) return
        hotArtTrigger(arg)
        return () => {
            handleRefetchTrigger && handleRefetchTrigger()
        }
    }, [refetchTrigger, hotArtTrigger, handleRefetchTrigger])

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
    function handleHollowPanel () {
        setIsHollowPanelOpen(!isHollowPanelOpen)
    }
    function handleKeyword (keyword: string) {
        if (!keyword) return setKeyHollows([])
        keyArg.keyword = keyword
        keyHollowTrigger(keyArg)
    }
    const artsWithoutNewarts = articles.filter(art => !newArtMap.get(art.id))

    return (
        <main className='w-full md:mx-auto md:w-4/5 lg:w-6/12'>

            <div className='hidden sm:block mt-20 mx-2 w-full border rounded-lg transition-height ease-out duration-300'>
                {currentUser && csrfToken && <ArticleInput 
                hollows={hollows} 
                currentUser={currentUser} 
                handleAddArt={handleAddArt}
                handleHollowPanel={handleHollowPanel}
                handleKeyword={handleKeyword}
                keyHollows={keyHollows} />}

                {currentUser && csrfToken && isHollowPanelOpen && <HollowCreatePanel 
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
                    {newArticles && newArticles.map(art => {
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
                    {artsWithoutNewarts && artsWithoutNewarts.map(art => {
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
                    {artSize >= total && <p className='text-center text-stone-400 pb-4'>已沒有其他話題</p>}
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
        const { count: articleCounts, rows: articleRows, total } = articles?.payload
        const { count: hollowCounts, rows: hollowRows } = hollows?.payload
        const csrfToken = await getCsrfToken(context)
        return {
            props: { articleCounts, articleRows, hollowCounts, hollowRows, csrfToken, total }
        }
    } catch (err) {
        console.log(err)
    }
}
