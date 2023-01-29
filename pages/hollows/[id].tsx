import { useRouter } from 'next/router'
import { useState } from 'react'
import useSWR from 'swr';
import { getHollow } from '../../api_helpers/apis/hollow';
import Link from 'next/link'
import { Iarticle, Ihollow, Iuser } from '../../type-config'
import ArticleCard from '../../components/article/articleCard'
import ArticleInput from '../../components/article/articleInput'


interface hollowProps {
    art: Iarticle
}


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
        hollowId: 'h1',
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
        hollowId: 'h1',
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
        hollowId: 'h1',
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

const currentUser: Iuser = {
    id: 'u1',
    name: '白文鳥',
    account: 'abc123',
    articles: 5,
    subHollows: 2,
    createAt: '20230106',
    role: 'user'
}

export default function Hollow () {
    const router = useRouter()
    const { id } = router.query
    const { data, error } = useSWR(id, fetchHollow);
    const hollowData = data?.data
    const [articles, setArticles] = useState<Iarticle[]>(dummyArticles)
    function handleAddArt (article: Iarticle) {
        setArticles([...articles, article])
    }

    return (
        <>
            <div className='mt-20 mx-2 w-full md:mx-auto md:w-4/5 lg:w-3/5'>
                <div className='grid grid-cols-12'>
                    <button className=''>back</button>

                    {hollowData? 
                    <h1 className='col-start-2 col-span-10 text-2xl font-semibold'>{hollowData.name}</h1> :
                     <h1 className='col-start-2 col-span-10 text-2xl font-semibold'>Loading!!!!!</h1>
                    }

                    <button>關注樹洞</button>
                </div>

                <ArticleInput handleAddArt={handleAddArt} currentUser={currentUser} hollows={dummyHollows} />
                
                {dummyArticles && dummyArticles.map(art => {
                    return (
                        <Link href={`/articles/${art.id}`} key={art.id} >
                            <ArticleCard art={art}/>
                        </Link>
                    )
                })}
            </div>
        </>
    )
}

async function fetchHollow (id: string) {
    try {
        const res = await getHollow(id)
        return res
    } catch (err) {
        console.log(err)
    }
}