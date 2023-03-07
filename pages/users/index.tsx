import { useEffect, useState, useContext, useRef } from 'react'
import Link from 'next/link'
import useSWRMutation from 'swr/mutation'
import { getHollows } from '../../api_helpers/apis/hollow'
import { fetchCurrentUser, fetchEditUser, fetchGetUserArts, fetchUserLike, fetchDeleteUserLike, fetchGetUserCollections, fetchUserCollect, fetchDeleteUserCollect, fetchUser, fetchAddHollow, fetchHotHollows, fetchHotArticles, fetchArticle, fetchAddArt, fetchEditArticle, fetchDeleteArticle } from '../../api_helpers/fetchers'
import { Iuser, Ihollow, Iarticle, Icomment, param, serverProps,  articleArg, deleteArg, successResult, likePayload, paramArg, rows, IArticleContext, ILikeship, ICollection, subPayload } from '../../type-config';
import UserPanel from '../../components/user/userPanel'
import { formattedArticles, formattedHollows } from '../../helpers/helpers'
import { articleContext, UIContext } from '../../components/ArticleProvider'
import { userContext } from '../../components/UserProvider'
import useArticleRecord from '../../components/hooks/useArticleRecord'
import useHollowRecord from '../../components/hooks/useHollowRecord';
import ArticleCardController from '../../components/article/articleCardController'
import HollowCard from '../../components/hollow/hollowCard'
// 修改個人資料 

const arg: param = { page: 1, limit: 10, keyword: '' }

export default function User() {
    const { currentUser, handleSetCurrentUser } = useContext(userContext)
    const { currentArticleId, handleIdChange, refetchTrigger, handleRefetchTrigger } = useContext(articleContext)
    const { handleConfirmWindow, handleEditWindow } = useContext(UIContext)

    const currentUserId = currentUser?.id
    const [moreShowingId, setMoreShowingId] = useState<string>('')
    const [userArticles, setUserArticles] = useState<Iarticle[]>([])
    const [collectedArticles, setCollectedArticles] = useState<Iarticle[]>([])
    const [hollows, setHollows] = useState<Ihollow[]>([])
    const [showingPanel, setShowingPanel] = useState<string>('col')  // col / pub / sub

    // 抓取一包收藏文章
    const { trigger: collectionsTrigger, data: collectionsData, error: collectionsError } = useSWRMutation<successResult, Error>(`user/${currentUserId}/collections`, fetchGetUserCollections);
    // 抓取目前使用者的文章
    const { trigger: userArtsTrigger, data: userArtsData, error: userArtsError } = useSWRMutation<successResult, Error>(`user/${currentUserId}/articles`, fetchGetUserArts);
    // 抓取一包關注樹洞
    const { trigger: subsTrigger, data: subsData, error: subsError } = useSWRMutation<successResult, Error>(`user/${currentUserId}/subscriptions`, fetchGetUserCollections);
    // 抓取一包樹洞
    const { trigger: hotHollowTrigger, data: hotHollowData, error: hotHollowError } = useSWRMutation<successResult, Error>(`hollow`, fetchHotHollows);
    // 抓取一篇文章
    const { trigger: artTrigger, data: artData, error: artError } = useSWRMutation<successResult, Error>(`article/${currentArticleId}`, fetchArticle);
    // 抓取目前 user
    const { trigger: userTrigger, data: userData, error: userError } = useSWRMutation<successResult, Error>(`getCurrentUser`, fetchCurrentUser);
    const currentUserDetail = currentUser

    // 修改 user 資料
    const { trigger: userEditTrigger, data: userEditData, error: userEditError } = useSWRMutation<successResult, Error>(`user/${currentUserId}`, fetchEditUser, { onSuccess: (data: successResult) => {
        const payload = data.payload as Iuser
        handleSetCurrentUser && handleSetCurrentUser(payload)
    } });
    // 喜歡和收藏的 fetch hook
    const { artRecordTrigger, getRecordIsMutating } = useArticleRecord({onArtRecordSuccess})
    // 關注的 fetch hook
    const { hollowRecordTrigger, getHollowRecordIsMutating } = useHollowRecord({onSuccessCallback})

    const currentArticleIdRef = useRef<number>()

    function onArtRecordSuccess (data: successResult) {
        const { article_id } = data.payload as ICollection | ILikeship
        if (!article_id) return
        artTrigger()
    }
    function onSuccessCallback (data: successResult) {
        collectionsTrigger(arg)
        hotHollowTrigger(arg)
        userArtsTrigger(arg)
    }
    // 初次渲染就可抓取目前使用者
    useEffect(() => {
        userTrigger()
    }, [userTrigger])
    // 有 userId 才 fetch API
    useEffect(() => {
        if (!currentUserId) return
        userArtsTrigger(arg)
        collectionsTrigger(arg)
        subsTrigger(arg)
    }, [currentUserId, collectionsTrigger, userArtsTrigger, subsTrigger])
    // 抓回來一整包的使用者文章資料
    useEffect(() => {
        if (!currentUserId) return
        if (!userArtsData) return
        
        const artRows = userArtsData?.payload as Iarticle[]
        const arts = formattedArticles(currentUserId, artRows)
        setUserArticles(arts)
    }, [currentUserId, userArtsData])
    // 抓回來一整包的使用者收藏文章資料
    useEffect(() => {
        if (!currentUserId) return
        if (!collectionsData) return
        
        const artRows = collectionsData?.payload as Iarticle[]
        const arts = formattedArticles(currentUserId, artRows)
        setCollectedArticles(arts)
    }, [currentUserId, collectionsData])
    // 抓回來一整包的樹洞資料
    useEffect(() => {
        if (!currentUserId) return
        if (!subsData) return
        const hollowRows = subsData?.payload as Ihollow[]
        const hollows = formattedHollows(currentUserId, hollowRows)
        setHollows(hollows)
    }, [currentUserId, subsData])
    
    // 刪除文章後重新 fetch API
    useEffect(() => {
        if (!refetchTrigger) return
        collectionsTrigger(arg)
        userArtsTrigger(arg)
        return () => {
            handleRefetchTrigger && handleRefetchTrigger()
        }
    }, [refetchTrigger, collectionsTrigger, userArtsTrigger, handleRefetchTrigger])


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
    function handleEditUser (user: Iuser) {
        if (!user) return
        userEditTrigger(user)
    }
    function handleClickPanel (type: string) {
        if (!type) return
        setShowingPanel(type)
    }

    return (
        <main className='w-full md:mx-auto md:w-4/5 lg:w-6/12'>
            <UserPanel currentUserDetail={currentUserDetail} handleEditUser={handleEditUser} />

            <div className='pt-6 w-full flex justify-center'>
                {showingPanel !== 'col' && <button className='text-slate-300 text-xl font-semibold hover:text-slate-400 cursor-pointer' onClick={() => handleClickPanel('col')}>收藏的話題</button>}
                {showingPanel === 'col' && <div className='text-slate-600 text-xl font-semibold' onClick={() => handleClickPanel('col')}>收藏的話題</div>}

                <h1 className='text-slate-300 px-4'>/</h1>

                {showingPanel !== 'pub' && <button className='text-slate-300 text-xl font-semibold hover:text-slate-400 cursor-pointer' onClick={() => handleClickPanel('pub')}>開啟的話題</button>}
                {showingPanel === 'pub' && <div className='text-slate-600 text-xl font-semibold' onClick={() => handleClickPanel('pub')}>開啟的話題</div>}

                <h1 className='text-slate-300 px-4'>/</h1>

                {showingPanel !== 'sub' && <button className='text-slate-300 text-xl font-semibold hover:text-slate-400 cursor-pointer' onClick={() => handleClickPanel('sub')}>關注的樹洞</button>}
                {showingPanel === 'sub' && <div className='text-slate-600 text-xl font-semibold' onClick={() => handleClickPanel('sub')}>關注的樹洞</div>}
            </div>

            <div className='py-6 mx-2 w-full'>

                <div className='flex-col justify-center w-full'>
                    {showingPanel === 'col' && collectedArticles && collectedArticles.map(art => {
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
                    {showingPanel === 'pub' && userArticles && userArticles.map(art => {
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
                    <div className='grid gap-4'>
                        {showingPanel === 'sub' && hollows && hollows.map(hollow => {
                            return (
                                <Link href={`/hollows/${hollow.id}`} key={hollow.id}>
                                    <HollowCard hollow={hollow} handleSub={handleSub} />
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </div>
        </main>
    )
}