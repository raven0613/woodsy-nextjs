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
import { fetchHotHollows, fetchHotArticles, fetchAddArt, fetchEditArticle, fetchDeleteArticle } from '../api_helpers/fetchers'
import { type } from 'os';
import { Iuser, Ihollow, Iarticle, Icomment, param, serverProps,  articleArg, deleteArg } from '../type-config';
import { getCsrfToken } from 'next-auth/react';
import { CtxOrReq } from 'next-auth/client/_utils';

const inter = Inter({ subsets: ['latin'] })

const currentUser: Iuser = {
    id: 1,
    name: '白文鳥',
    account: 'abc123',
    articleCounts: 5,
    subHollows: 2,
    createAt: '20230106',
    role: 'user',
    email: '',
    password: ''
}

export const articlesWithHollowName = (hollows: Ihollow[], articles: Iarticle[]): Iarticle[] => {
    return articles.map(article => {
        const targetHollow = hollows.find(h => article.hollow_id === h.id)
        const des = article.content.length < 200? article.content : article.content.trim().slice(0, 200) + '...'
        return { ...article, hollowName: targetHollow?.name || '', description: des}
    })
}


export default function Home({ articleCounts, articleRows, hollowCounts, hollowRows, csrfToken }: serverProps) {
    const [moreShowingId, setMoreShowingId] = useState<string>('')

    // 新增一則文章
    const { trigger: addArtTrigger, isMutating: addArtIsMutating, data: addedArtData, error: addedArtError } = useSWRMutation<Iarticle, Error>(`article`, fetchAddArt);
    // 刪除一篇文章
    const { trigger: deleteArtTrigger, isMutating: deleteArtIsMutating, data: deletedArtData, error: deletedArtError } = useSWRMutation<Iarticle, Error>(`article`, fetchDeleteArticle);

    // const { data: hollowData, error: hollowError } = useSWR(['hollow', params], ([url, params]) => fetchHotHollows(url, params));
    // const { data: artData, error: artError } = useSWR(['article', params], ([url, params]) => fetchHotArticles(url, params));

    const [articles, setArticles] = useState<Iarticle[]>([])
    const [hollows, setHollows] = useState<Ihollow[]>([])
    
    useEffect(() => {
        const hotHollows: Ihollow[] = hollowRows? hollowRows : []
        const hotArticles: Iarticle[] = articleRows? articleRows : []
        const arts = articlesWithHollowName(hotHollows, hotArticles)
        setHollows(hotHollows)
        setArticles(arts)
    }, [articleRows, hollowRows])


    function handleAddArt (article: Iarticle) {
        addArtTrigger(article)
        setArticles([...articles, article])
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
                {articles && articles.map(art => {
                return (
                    <ArticleCard article={art} key={art.id} 
                    handleClickMore={handleClickMore}
                    handleCloseMore={handleCloseMore}
                    handleDeleteArt={handleDeleteArt}
                    moreShowingId={moreShowingId} />
                )
                })}
            </div>
        </div>
    </main>
    )
}

export async function getServerSideProps(context: CtxOrReq | undefined) {
    const params: param = { page: 1, limit: 10 }
    try {
        const [articles, hollows] = await Promise.all([
            fetchHotArticles('article', params),
            fetchHotHollows('hollow', params)
        ])
        const { count: articleCounts, rows: articleRows } = articles?.data.payload
        const { count: hollowCounts, rows: hollowRows } = hollows?.data.payload
        const csrfToken = await getCsrfToken(context)
        return {
            props: { articleCounts, articleRows, hollowCounts, hollowRows, csrfToken }
        }
    } catch (err) {
        console.log(err)
    }
}
