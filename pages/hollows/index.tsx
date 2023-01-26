import { useRouter } from 'next/router'
import Link from 'next/link'
import { Ihollow } from '../home'
import HollowCreatePanel from "../../components/hollow/hollowCreatePanel"
import HollowCard from '../../components/hollow/hollowCard'
import Navbar from '../../components/navbar'

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
//樹洞可以選擇顯示簡單版或複雜版
//複雜版有顯示熱門文章


export default function HollowList () {
    return (
        <>
            <div className='mt-20 mx-2 w-full md:mx-auto md:w-4/5 lg:w-3/5'>
                <h1 className='text-3xl font-bold'>Hollow</h1>
                <input className='border w-60 h-10 px-4' type="text" placeholder='請輸入樹洞名稱'/>

                <h1 className='text-2xl font-bold'>關注的樹洞</h1>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                    {dummyHollows && dummyHollows.map(hollow => {
                        return (
                            <Link href={`/hollows/${hollow.id}`} key={hollow.id}>
                                <HollowCard hollow={hollow}/>
                            </Link>
                        )
                    })}
                </div>

                <h1 className='text-2xl font-bold'>最近去過的樹洞</h1>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                    {dummyHollows && dummyHollows.map(hollow => {
                        return (
                            <Link href={`/hollows/${hollow.id}`} key={hollow.id}>
                                <HollowCard hollow={hollow}/>
                            </Link>
                        )
                    })}
                </div>

                <h1 className='text-2xl font-bold'>所有樹洞</h1>
                <div className='grid grid-cols-1 gap-4'>
                    {dummyHollows && dummyHollows.map(hollow => {
                        return (
                            <Link href={`/hollows/${hollow.id}`} key={hollow.id}>
                                <HollowCard hollow={hollow}/>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </>
    )
}

function subHollows (hollows: Ihollow[]) {
    
}