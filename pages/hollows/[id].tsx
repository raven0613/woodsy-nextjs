import { useRouter } from 'next/router'
import React, { useContext, useEffect, useRef, useState } from 'react'
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation'
import { getHollow } from '../../api_helpers/apis/hollow';
import Link from 'next/link'
import { deleteArg, Iarticle, ICollection, Ihollow, ILikeship, Iuser, param, rows, subPayload, successResult } from '../../type-config'
import ArticleCardController from '../../components/article/articleCardController'
import ArticleInput from '../../components/article/articleInput'
import { fetchHotHollows, fetchAddHollow, fetchHollow, fetchHotArticles, fetchAddArt, fetchArticle } from '../../api_helpers/fetchers'
import { formattedArticles, formattedHollows } from '../../helpers/helpers'
import { useSession } from 'next-auth/react';
import useArticleRecord from '../../components/hooks/useArticleRecord'
import useHollowRecord from '../../components/hooks/useHollowRecord'
import { articleContext, UIContext } from '../../components/ArticleProvider';
import { userContext } from '../../components/UserProvider'
import useThrottle from '../../components/hooks/useThrottle';

const arg = { page: 1, limit: 10, keyword: '' }
const artMap = new Map()
const newArtMap = new Map()
let total = 0

export default function Hollow () {
    const { currentUser, handleSetCurrentUser } = useContext(userContext)
    const { currentArticleId, handleIdChange, refetchTrigger, handleRefetchTrigger } = useContext(articleContext)
    const { handleConfirmWindow, handleEditWindow } = useContext(UIContext)

    const currentUserId = currentUser?.id

    const router = useRouter()
    const { id } = router.query || ''
    
    const currentArticleIdRef = useRef<number>()
    const [page, setPage] = useState<number>(2)
    const [moreShowingId, setMoreShowingId] = useState<string>('')
    const [articles, setArticles] = useState<Iarticle[]>([])
    const [newArticles, setNewArticles] = useState<Iarticle[]>([])
    const [hollow, setHollow] = useState<Ihollow>({
        id: Number(id)? Number(id) : 0,
        name: "",
        type: "",
        articleCounts: 0,
        subCounts: 0,
        user_id: 0,
    })
    const [hollows, setHollows] = useState<Ihollow[]>([])
    const [keyHollows, setKeyHollows] = useState<Ihollow[]>([])
    const [isHollowPanelOpen, setIsHollowPanelOpen] = useState<boolean>(false)
    const isSub: boolean = hollow.isSub || false

    // 抓取現在樹洞
    const { trigger: hollowTrigger, data: hollowData, error: hollowError } = useSWRMutation<successResult, Error>(id, fetchHollow);

    // 得到該樹洞的所有文章
    const { trigger: hotArtTrigger, data: hotArtData, error: hotArtError } = useSWRMutation<successResult, Error>(`hollow/${id}/articles`, fetchHotArticles);

    // 抓取一包樹洞(給 input 用)
    const { trigger: hollowsTrigger, data: hollowsData, error: hollowsError } = useSWRMutation<successResult, Error>(`hollow`, fetchHotHollows);
    // 抓取一包關鍵字樹洞
    const { trigger: keyHollowTrigger, data: keyHollowData, error: keyHollowError } = useSWRMutation<successResult, Error>(`hollow`, fetchHotHollows, {
        onSuccess: (data: successResult) => {
            const { rows } = data.payload as rows
            setKeyHollows(rows as Ihollow[])
        }
    });
    // 新增一個樹洞
    const { trigger: addHollowTrigger, isMutating: addHollowIsMutating, data: addedHollowData, error: addedHollowError } = useSWRMutation<successResult, Error>(`hollow`, fetchAddHollow, { onSuccess: (data: successResult) => { 
        // const payload = data.payload as Ihollow
        hollowsTrigger(arg)
    }});

    // 新增一則文章
    const { trigger: addArtTrigger, isMutating: addArtIsMutating, data: addedArtData, error: addedArtError } = useSWRMutation<successResult, Error>(`article`, fetchAddArt, { onSuccess: (data: successResult) => { 
        const payload = data.payload as Iarticle
        const art = formattedArticles(currentUserId as number, [payload] as Iarticle[])[0]
        setNewArticles(arts => [art, ...arts])
        if (!newArtMap.get(art.id)) {
            newArtMap.set(art.id, 1)
        }
    }});
    // 抓取一篇文章
    const { trigger: artTrigger, data: artData, error: artError } = useSWRMutation<successResult, Error>(`article/${currentArticleIdRef.current}`, fetchArticle);

    // 喜歡和收藏的 fetch hook
    const { artRecordTrigger, getRecordIsMutating } = useArticleRecord({onArtRecordSuccess})
    // 關注的 fetch hook
    const { hollowRecordTrigger, getHollowRecordIsMutating } = useHollowRecord({onSuccessCallback})

    const artSize = articles.length
    
    useThrottle({hotArtTrigger, page, setPage, artSize, total})

    function onArtRecordSuccess (data: successResult) {
        const { article_id } = data.payload as ICollection | ILikeship
        if (!article_id) return
        artTrigger()
    }
    function onSuccessCallback (data: successResult) {
        hotArtTrigger(arg)
        hollowTrigger()
    }
    useEffect(() => {
        newArtMap.clear()
        artMap.clear()
        setPage(2)
        hollowsTrigger(arg)
    }, [hollowsTrigger])
    useEffect(() => {
        if (!id || !hotArtTrigger || !hollowTrigger) return
        hollowTrigger()
        hotArtTrigger(arg)
    }, [id, hotArtTrigger, hollowTrigger])

    //熱門樹洞
    useEffect(() => {
        if (!currentUserId || !hollowsData) return
        const hollowRows = hollowsData?.payload as rows
        const hollowDatas = hollowRows.rows as Ihollow[]
        const hollows = formattedHollows(currentUserId, hollowDatas)
        setHollows(hollows)
    }, [hollowsData, currentUserId])
    //目前樹洞
    useEffect(() => {
        if (!currentUserId || !hollowData) return
        const hollowPayload = hollowData.payload as Ihollow
        const hollows = formattedHollows(currentUserId, [hollowPayload])[0]
        setHollow(hollows)
    }, [hollowData, currentUserId])
    // 熱門文章
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
        total = artRows.total || 0
    }, [hotArtData, currentUserId])

    // 刪除文章後重新 fetch API
    useEffect(() => {
        if (!refetchTrigger) return
        hotArtTrigger(arg)
        return () => {
            handleRefetchTrigger && handleRefetchTrigger()
        }
    }, [refetchTrigger, hotArtTrigger, handleRefetchTrigger])

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
    function handleSub (e: React.MouseEvent) {
        if (!id || !currentUserId) return
         if (getHollowRecordIsMutating('sub') || getHollowRecordIsMutating('deleteSub')) return
        e.preventDefault()
        e.stopPropagation()
        const payload: subPayload = { user_id: currentUserId, hollow_id: Number(id) }
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
        arg.keyword = keyword
        keyHollowTrigger(arg)
    }

    const artsWithoutNewarts = articles.filter(art => !newArtMap.get(art.id))
    return (
        <>
            <div className='mt-20 mx-2 w-full md:mx-auto md:w-4/5 lg:w-6/12'>
                <div className='grid grid-cols-12 h-12'>
                    <button onClick={() => router.back()} className=''>←</button>

                    {hollow? 
                        <h1 className='col-start-2 col-span-10 text-2xl font-semibold leading-loose h-full'>{hollow.name}</h1> 
                        :
                        <h1 className='col-start-2 col-span-10 text-2xl font-semibold'>Loading!!!!!</h1>
                    }

                    {!hollow.isSub && <button onClick={handleSub}>關注 {hollow.subCounts}</button>}
                    {hollow.isSub && <button onClick={handleSub}>已關注 {hollow.subCounts}</button>}
                </div>

                <div className='hidden sm:block mx-2 w-full border rounded-lg transition-height ease-out duration-300'>
                    <ArticleInput 
                    currentHollow={hollow}
                    handleAddArt={handleAddArt} 
                    currentUser={currentUser} 
                    hollows={hollows}
                    handleHollowPanel={handleHollowPanel}
                    handleKeyword={handleKeyword}
                    keyHollows={keyHollows} />
                </div>
                
                <h1 className='text-2xl font-semibold leading-loose h-full pb-2 pt-4 pl-2'>話題</h1>
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
                {artSize >= total && articles.length > 10 && <p className='text-center text-stone-400 pb-4'>已沒有其他話題</p>}
                {articles.length < 1 && <p className='text-center text-stone-400 pb-4'>這個樹洞目前是空的</p>}
            </div>
        </>
    )
}