import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation'
import { getHollow } from '../../api_helpers/apis/hollow';
import Link from 'next/link'
import { deleteArg, Iarticle, Ihollow, Iuser, param } from '../../type-config'
import ArticleCard from '../../components/article/articleCard'
import ArticleInput from '../../components/article/articleInput'
import { fetchHotHollows, fetchHollow, fetchHotArticles, fetchAddArt, fetchDeleteArticle } from '../../api_helpers/fetchers'
import { formattedArticles } from '../home'
import { useSession } from 'next-auth/react';


const params: param = { page: 1, limit: 15 }

export default function Hollow () {
    useEffect(() => {
        window.addEventListener('scroll', handleScroll)
        return () => { window.removeEventListener('scroll', handleScroll) }
    }, [])

    const { data: session, status } = useSession()

    const currentUser: Iuser = session? { ...session.user } : {
        name: '', email: '', account: '', role: ''
    }
    const currentUserId = currentUser.id

    const router = useRouter()
    const { id } = router.query
    const { data, error } = useSWR(id, fetchHollow);
    const hollowData = data?.data.payload
    

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

    // 得到該樹洞的所有文章
    const { data: articlesData, error: articlesError } = useSWR([`hollow/${id}/articles`, params], ([url, params]) => fetchHotArticles(url, params));

    // 得到熱門樹洞(給 input 用)
    const { data: hollowsData, error: hollowsError } = useSWR(['hollow', params], ([url, params]) => fetchHotHollows(url, params));

    // 新增一則文章
    const { trigger: addArtTrigger, isMutating: addArtIsMutating, data: addedArtData, error: addedArtError } = useSWRMutation<Iarticle, Error>(`article`, fetchAddArt);

    // 刪除一篇文章
    const { trigger: deleteArtTrigger, isMutating: deleteArtIsMutating, data: deletedArtData, error: deletedArtError } = useSWRMutation<Iarticle, Error>(`article`, fetchDeleteArticle);
    
    //熱門樹洞
    useEffect(() => {
        console.log(hollowsData)
        if (!hollowsData) return
        const fetchedHollows: Ihollow[] = hollowsData? hollowsData.data.payload.rows : []
        setHollows(fetchedHollows)
    }, [hollowsData])
    //目前樹洞
    useEffect(() => {
        if (!hollowData) return
        setHollow(hollowData)
    }, [hollowData])
    // 熱門文章
    useEffect(() => {
        if (!currentUserId || !articlesData) return
        const fetchedArts: Iarticle[] = articlesData? articlesData.data.payload.rows : []
        const arts = formattedArticles(currentUserId, fetchedArts)
        setArticles(arts)
    }, [hollow, articlesData, currentUserId])


    function handleDeleteArt (articleId: number) {
        deleteArtTrigger(articleId)
    }
    function handleAddArt (article: Iarticle) {
        addArtTrigger(article)
        //TODO: 目前跳頁後文章沒有被增加上去
        if (article.hollow_id !== Number(id)) return router.push(`/hollows/${article.hollow_id}`)
        setArticles([...articles, article])
    }
    function handleClickMore (artId: string) {
        setMoreShowingId(artId)
    }
    function handleCloseMore () {
        setMoreShowingId('')
    }
    function handleScroll () {
        // console.log(window.scrollY)
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

                    <button>關注</button>
                </div>

                <ArticleInput 
                currentHollow={hollow}
                handleAddArt={handleAddArt} 
                currentUser={currentUser} 
                hollows={hollows} />
                
                <h1 className='text-2xl font-semibold leading-loose h-full pb-2 pt-4 pl-2'>話題</h1>
                {articles && articles.map(art => {
                    return (
                        <ArticleCard article={art} key={art.id}
                        handleClickMore={handleClickMore}
                        handleCloseMore={handleCloseMore}
                        handleDeleteArt={handleDeleteArt}
                        moreShowingId={moreShowingId} 
                        currentUser={currentUser} />
                    )
                })}
                {articles.length < 1 && <p className=''>這個樹洞目前是空的</p>}
            </div>
        </>
    )
}