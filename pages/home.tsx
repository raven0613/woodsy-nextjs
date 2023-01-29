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
import { getArticles, addArticle } from '../api_helpers/apis/article'
import { type } from 'os';
import { Iuser, Ihollow, Iarticle, Icomment, param, serverProps,  articleArg } from '../type-config';

const inter = Inter({ subsets: ['latin'] })

const currentUser: Iuser = {
    id: 1,
    name: '白文鳥',
    account: 'abc123',
    articles: 5,
    subHollows: 2,
    createAt: '20230106',
    role: 'user'
}

const articlesWithHollowName = (hollows: Ihollow[], articles: Iarticle[]): Iarticle[] => {
    return articles.map(article => {
        const targetHollow = hollows.find(h => article.hollowId === h.id)
        const des = article.content.length < 10? article.content : article.content.trim().slice(0, 10) + '...'
        return { ...article, hollowName: targetHollow?.name || '', description: des}
    })
}
const params: param = { page: 1, limit: 10 }

export default function Home({ articleCounts, articleRows, hollowCounts, hollowRows }: serverProps) {
    // 新增一則文章
    const { trigger: addArtTrigger, isMutating: addArtIsMutating, data: addedArtData, error: addedArtError } = useSWRMutation<Iarticle, Error>(`article`, fetchAddArt);
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
    function handleAddHollow (hollow: Ihollow) {
        setHollows([...hollows, hollow])
    }

    return (
    <>
        <div className='mt-20 mx-2 w-full md:mx-auto md:w-4/5 lg:w-3/5'>
            <ArticleInput 
            hollows={hollows} 
            currentUser={currentUser} 
            handleAddArt={handleAddArt}/>

            <HollowCreatePanel 
            currentUser={currentUser} 
            hollows={hollows} 
            handleAddHollow={handleAddHollow}/>


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
        <div className='mx-2 w-full md:m-auto md:w-4/5 lg:w-3/5'>
            <h1 className='text-slate-300 text-xl font-semibold'>大家關心的話題</h1>
            <div className='flex-col justify-center w-full'>
                {articles && articles.map(art => {
                return (
                <Link href={`/articles/${art.id}`} key={art.id} >
                    <ArticleCard art={art}/>
                </Link>
                )
                })}
            </div>
        </div>
        <ToTopButton />
    </>
    )
}

export async function getServerSideProps() {
    try {
        const [articles, hollows] = await Promise.all([
            fetchHotArticles('article', { page: 1, limit: 10 }),
            fetchHotHollows('hollow', { page: 1, limit: 10 })
        ])
        const { count: articleCounts, rows: articleRows } = articles?.data
        const { count: hollowCounts, rows: hollowRows } = hollows?.data
        return {
            props: { articleCounts, articleRows, hollowCounts, hollowRows }
        }
    } catch (err) {
        console.log(err)
    }
}


async function fetchHotHollows (url: string, { page, limit }: param) {
    try {
        const res = await getHollows(url, page, limit)
        return res
    } catch (err) {
        console.log(err)
    }
}

async function fetchHotArticles (url: string, { page, limit }: param) {
    try {
        const res = await getArticles(url, page, limit)
        return res
    } catch (err) {
        console.log(err)
    }
}

async function fetchAddArt (url: string, { arg }: articleArg) {
    try {
        const { data } = await addArticle(url, arg)
        return data
    } catch (err) {
        console.log(err)
    }
}
