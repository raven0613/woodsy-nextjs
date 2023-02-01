import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import useSWR from 'swr';
import { getHollow } from '../../api_helpers/apis/hollow';
import Link from 'next/link'
import { Iarticle, Ihollow, Iuser, param } from '../../type-config'
import ArticleCard from '../../components/article/articleCard'
import ArticleInput from '../../components/article/articleInput'
import { getArticles, addArticle } from '../../api_helpers/apis/article'
import { articlesWithHollowName } from '../home'

interface hollowProps {
    art: Iarticle
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

const currentUser: Iuser = {
    id: 2,
    name: '白文鳥',
    account: 'abc123',
    articles: 5,
    subHollows: 2,
    createAt: '20230106',
    role: 'user',
    email: '',
    password: ''
}

const params: param = { page: 1, limit: 15 }

export default function Hollow () {
    useEffect(() => {
        window.addEventListener('scroll', handleScroll)
        return () => { window.removeEventListener('scroll', handleScroll) }
    }, [])

    const router = useRouter()
    const { id } = router.query
    const { data, error } = useSWR(id, fetchHollow);
    const hollowData = data?.data

    const [moreShowingId, setMoreShowingId] = useState<number>(0)
    const [articles, setArticles] = useState<Iarticle[]>([])

    const { data: articlesData, error: articlesError } = useSWR(['article', params], ([url, params]) => fetchArticles(url, params));

    useEffect(() => {
        const fetchedArts: Iarticle[] = articlesData? articlesData.data.rows : []
        setArticles(fetchedArts)
    }, [articlesData])

    useEffect(() => {
        console.log(hollowData)
        const fetchedArts: Iarticle[] = articlesData? articlesData.data.rows : []
        const arts = articlesWithHollowName([hollowData], fetchedArts)
        setArticles(arts)
    }, [hollowData, articlesData])



    

    function handleAddArt (article: Iarticle) {
        setArticles([...articles, article])
    }
    function handleClickMore (artId: number) {
        setMoreShowingId(artId)
    }
    function handleScroll () {
        // console.log(window.scrollY)
    }
    return (
        <>
            <div className='mt-20 mx-2 w-full md:mx-auto md:w-4/5 lg:w-3/5'>
                <div className='grid grid-cols-12 h-12'>
                    <button className=''>←</button>

                    {hollowData? 
                        <h1 className='col-start-2 col-span-10 text-2xl font-semibold leading-loose h-full'>{hollowData.name}</h1> :
                        <h1 className='col-start-2 col-span-10 text-2xl font-semibold'>Loading!!!!!</h1>
                    }

                    <button>關注</button>
                </div>

                <ArticleInput handleAddArt={handleAddArt} currentUser={currentUser} hollows={dummyHollows} />
                
                <h1 className='text-2xl font-semibold leading-loose h-full pb-2 pt-4 pl-2'>話題</h1>
                {articles && articles.map(art => {
                    return (
                        <Link href={`/articles/${art.id}`} key={art.id} >
                            <ArticleCard art={art}
                            handleClickMore={handleClickMore}
                            moreShowingId={moreShowingId} />
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

async function fetchArticles (url: string, { page, limit }: param) {
    console.log('來')
    try {
        const res = await getArticles(url, page, limit)
        return res
    } catch (err) {
        console.log(err)
    }
}