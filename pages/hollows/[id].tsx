import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation'
import { getHollow } from '../../api_helpers/apis/hollow';
import Link from 'next/link'
import { deleteArg, Iarticle, ICollection, Ihollow, Iuser, param, rows, subPayload, successResult } from '../../type-config'
import ArticleCardController from '../../components/article/articleCardController'
import ArticleInput from '../../components/article/articleInput'
import { fetchHotHollows, fetchAddHollow, fetchHollow, fetchHotArticles, fetchAddArt } from '../../api_helpers/fetchers'
import { formattedArticles, formattedHollows } from '../../helpers/helpers'
import { useSession } from 'next-auth/react';
import useArticleRecord from '../../components/hooks/useArticleRecord'
import useHollowRecord from '../../components/hooks/useHollowRecord'
import { articleContext, UIContext } from '../../components/ArticleProvider';
import { userContext } from '../../components/UserProvider'

const arg = { page: 1, limit: 10, keyword: '' }

export default function Hollow () {
    const { currentUser, handleSetCurrentUser } = useContext(userContext)
    const { currentArticleId, handleIdChange, refetchTrigger, handleRefetchTrigger } = useContext(articleContext)
    const { handleConfirmWindow, handleEditWindow } = useContext(UIContext)

    useEffect(() => {
        window.addEventListener('scroll', handleScroll)
        return () => { window.removeEventListener('scroll', handleScroll) }
    }, [])


    const { data: session, status } = useSession()

    const currentUserId = currentUser?.id

    const router = useRouter()
    const { id } = router.query || ''
    // const { data, error } = useSWR(id, fetchHollow);
    // const hollowData = data?.data.payload
    

    const [moreShowingId, setMoreShowingId] = useState<string>('')
    const [articles, setArticles] = useState<Iarticle[]>([])
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
    const { trigger:  hollowTrigger, data: hollowData, error: hollowError } = useSWRMutation<successResult, Error>(id, fetchHollow);

    // 得到該樹洞的所有文章
    const { trigger: articlesTrigger, data: articlesData, error: articlesError } = useSWRMutation<successResult, Error>(`hollow/${id}/articles`, fetchHotArticles);

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
        // const payload = data.payload as Iarticle
        // const art = formattedArticles(currentUserId as number, [payload] as Iarticle[])[0]
        // setNewArticle(art)
    }});
    // 喜歡和收藏的 fetch hook
    const { artRecordTrigger, getRecordIsMutating } = useArticleRecord({onSuccessCallback})
    // 關注的 fetch hook
    const { hollowRecordTrigger, getHollowRecordIsMutating } = useHollowRecord({onSuccessCallback})

    function onSuccessCallback (data: successResult) {
        // 按讚之後 newArt 會被蓋掉
        // const { article_id } = data.payload as ICollection
        // console.log('newArticle', newArticle)
        // console.log('article_id', article_id)
        // console.log('currentArticleIdRef.current', currentArticleIdRef.current)
        // if (article_id === currentArticleIdRef.current) {
        //     // return artTrigger()
        // }  //TODO: 新增文章的邏輯還沒調整好
        articlesTrigger(arg)
        hollowTrigger()
    }
    useEffect(() => {
        hollowsTrigger(arg)
    }, [hollowsTrigger])
    useEffect(() => {
        if (!id || !articlesTrigger || !hollowTrigger) return
        hollowTrigger()
        articlesTrigger(arg)
    }, [id, articlesTrigger, hollowTrigger])

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
        if (!currentUserId || !articlesData) return
        const artRows = articlesData?.payload as rows
        const artDatas = artRows.rows as Iarticle[]
        const arts = formattedArticles(currentUserId, artDatas)
        setArticles(arts)
    }, [articlesData, currentUserId])

    // 刪除文章後重新 fetch API
    useEffect(() => {
        if (!refetchTrigger) return
        articlesTrigger(arg)
        return () => {
            handleRefetchTrigger && handleRefetchTrigger()
        }
    }, [refetchTrigger, articlesTrigger, handleRefetchTrigger])

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
    function handleScroll () {

    }
    return (
        <>
            <div className='mt-20 mx-2 w-full md:mx-auto md:w-4/5 lg:w-6/12'>
                <div className='grid grid-cols-12 h-12'>
                    <button className=''>←</button>

                    {hollow? 
                        <h1 className='col-start-2 col-span-10 text-2xl font-semibold leading-loose h-full'>{hollow.name}</h1> 
                        :
                        <h1 className='col-start-2 col-span-10 text-2xl font-semibold'>Loading!!!!!</h1>
                    }

                    {!hollow.isSub && <button onClick={handleSub}>關注 {hollow.subCounts}</button>}
                    {hollow.isSub && <button onClick={handleSub}>已關注 {hollow.subCounts}</button>}
                </div>

                <ArticleInput 
                currentHollow={hollow}
                handleAddArt={handleAddArt} 
                currentUser={currentUser} 
                hollows={hollows}
                handleHollowPanel={handleHollowPanel}
                handleKeyword={handleKeyword}
                keyHollows={keyHollows} />
                
                <h1 className='text-2xl font-semibold leading-loose h-full pb-2 pt-4 pl-2'>話題</h1>
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
                {articles.length < 1 && <p className=''>這個樹洞目前是空的</p>}
            </div>
        </>
    )
}