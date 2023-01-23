import { useState } from 'react'
import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import HollowCard from '../components/hollowCard'
import ArticleCard from '../components/articleCard'
import ArticleInput from '../components/articleInput'
import Navbar from '../components/navbar'
import ToTopButton from '../components/toTopButton'
import HollowCreatePanel from "../components/hollowCreatePanel"

const inter = Inter({ subsets: ['latin'] })

export interface Iuser {
    id: string,
    name: string,
    account: string,
    articles: number,
    subHollows: number,
    createAt: string,
    role: string
}; 

export interface Ihollow {
    id: string,
    name: string,
    type: string,
    userId: string,
    article: number,
    isSub: boolean,
    subCounts: number,
    createdAt: string,
};

export interface Iarticle {
    id: string,
    title: string,
    hollowId: string,
    userId: string,
    content: string,
    comments: number,
    collectedCounts: number,
    likedCounts: number,
    reportedCounts: number,
    isCollected: boolean,
    isLiked: boolean,
    reportedAt: string,
    createdAt: string,
    hollowName?: string,
    description?: string
};

export interface Icomment {
    id: string,
    articleId: string,
    userId: string,
    content: string,
    likedCounts: number,
    reportedCounts: number,
    isLiked: boolean,
    reportedAt: string,
    createdAt: string,
    description?: string
};

const currentUser: Iuser = {
    id: 'u1',
    name: '白文鳥',
    account: 'abc123',
    articles: 5,
    subHollows: 2,
    createAt: '20230106',
    role: 'user'
}


const dummyHollows: Ihollow[] = [
  {
    id: 'h1',
    name: '心情',
    type: 'public',
    userId: 'u0',
    article: 10,
    isSub: true,
    subCounts: 100,
    createdAt: '20230105'
  },
  {
    id: 'h2',
    name: '八點檔',
    type: 'public',
    userId: 'u0',
    article: 5,
    isSub: false,
    subCounts: 500,
    createdAt: '20230105'
  },
  {
    id: 'h3',
    name: '股票',
    type: 'public',
    userId: 'u0',
    article: 5,
    isSub: false,
    subCounts: 35,
    createdAt: '20230105'
  },
  {
    id: 'h4',
    name: '寵物',
    type: 'public',
    userId: 'u0',
    article: 16,
    isSub: false,
    subCounts: 600,
    createdAt: '20230105'
  },
  {
    id: 'h5',
    name: '遊戲',
    type: 'public',
    userId: 'u0',
    article: 8,
    isSub: true,
    subCounts: 1000,
    createdAt: '20230105'
  },
  {
    id: 'h6',
    name: '仙境傳說',
    type: 'public',
    userId: 'u0',
    article: 8,
    isSub: true,
    subCounts: 250,
    createdAt: '20230105'
  },
  {
    id: 'h7',
    name: '寶可夢',
    type: 'public',
    userId: 'u0',
    article: 30,
    isSub: true,
    subCounts: 800,
    createdAt: '20230105'
  },
]

const dummyArticles: Iarticle[] = [
  {
    id: 'a1',
    title: '找工作嗚嗚',
    hollowId: 'h1',
    userId: 'u1',
    content: '好想趕快找到工作，過年後就想要找工作懂否',
    comments: 2,
    collectedCounts: 20,
    likedCounts: 50,
    reportedCounts: 1,
    isCollected: false,
    isLiked: false,
    reportedAt: '20230105',
    createdAt: '20230105'
  },
  {
    id: 'a2',
    title: '好好玩喔',
    hollowId: 'h7',
    userId: 'u1',
    content: '寶可夢好好玩朱紫真香難道我是真香玩家嗎',
    comments: 18,
    collectedCounts: 2,
    likedCounts: 100,
    reportedCounts: 0,
    isCollected: false,
    isLiked: false,
    reportedAt: '20230105',
    createdAt: '20230105'
  },
  {
    id: 'a3',
    title: '本多終勝',
    hollowId: 'h3',
    userId: 'u1',
    content: '現在買台積電還來得及嗎?',
    comments: 8,
    collectedCounts: 0,
    likedCounts: 20,
    reportedCounts: 5,
    isCollected: false,
    isLiked: false,
    reportedAt: '20230105',
    createdAt: '20230105'
  },
  {
    id: 'a4',
    title: '求牧師配點',
    hollowId: 'h6',
    userId: 'u1',
    content: '我想玩牧師可以請各位大大幫我配點嗎?',
    comments: 16,
    collectedCounts: 1,
    likedCounts: 3,
    reportedCounts: 27,
    isCollected: false,
    isLiked: false,
    reportedAt: '20230105',
    createdAt: '20230105'
  },
]

const articlesWithHollowName = (hollows: Ihollow[], articles: Iarticle[]): Iarticle[] => {
  return articles.map(article => {
    const targetHollow = hollows.find(h => article.hollowId === h.id)
    const des = article.content.length < 10? article.content : article.content.trim().slice(0, 10) + '...'
    return { ...article, hollowName: targetHollow?.name || '', description: des}
  })
}

export default function Home() {

    const [articles, setArticles] = useState<Iarticle[]>(articlesWithHollowName(dummyHollows, dummyArticles))
    const [hollows, setHollows] = useState<Ihollow[]>(dummyHollows)

    function handleAddArt (article: Iarticle) {
        setArticles([...articles, article])
    }
    function handleAddHollow (hollow: Ihollow) {
        setHollows([...hollows, hollow])
    }

    return (
    <>
        <Navbar />
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
