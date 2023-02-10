import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import Link from 'next/link'
import useSWRMutation from 'swr/mutation'
import { deleteArg, Iarticle, ICollection, Ihollow, Iuser, param, rows, subPayload, successResult, userSubPayload } from '../../type-config'
import HollowCreatePanel from "../../components/hollow/hollowCreatePanel"
import HollowCard from '../../components/hollow/hollowCard'
import { fetchGetUserSubs, fetchHotHollows, fetchAddHollow, fetchHollow, fetchHotArticles, fetchAddArt } from '../../api_helpers/fetchers'
import { formattedArticles, formattedHollows } from '../../helpers/helpers'
import { useSession } from 'next-auth/react';
import useHollowRecord from '../../components/hooks/useHollowRecord'
import { articleContext, UIContext } from '../../components/ArticleProvider';

const dummyHollows: Ihollow[] = [
  {
    id: 1,
    name: '心情',
    type: 'public',
    userId: 1,
    articleCounts: 10,
    isSub: true,
    subCounts: 100,
    createdAt: '20230105'
  },
  {
    id: 2,
    name: '八點檔',
    type: 'public',
    userId: 1,
    articleCounts: 5,
    isSub: false,
    subCounts: 500,
    createdAt: '20230105'
  },
  {
    id: 3,
    name: '股票',
    type: 'public',
    userId: 1,
    articleCounts: 5,
    isSub: false,
    subCounts: 35,
    createdAt: '20230105'
  },
  {
    id: 4,
    name: '寵物',
    type: 'public',
    userId: 1,
    articleCounts: 16,
    isSub: false,
    subCounts: 600,
    createdAt: '20230105'
  },
  {
    id: 5,
    name: '遊戲',
    type: 'public',
    userId: 1,
    articleCounts: 8,
    isSub: true,
    subCounts: 1000,
    createdAt: '20230105'
  },
  {
    id: 6,
    name: '仙境傳說',
    type: 'public',
    userId: 1,
    articleCounts: 8,
    isSub: true,
    subCounts: 250,
    createdAt: '20230105'
  },
  {
    id: 7,
    name: '寶可夢',
    type: 'public',
    userId: 1,
    articleCounts: 30,
    isSub: true,
    subCounts: 800,
    createdAt: '20230105'
  },
]
//樹洞可以選擇顯示簡單版或複雜版
//複雜版有顯示熱門文章

const arg: param = { page: 1, limit: 15 }

export default function HollowList () {
    const { data: session, status } = useSession()

    const [hollows, setHollows] = useState<Ihollow[]>([])
    const [subHollows, setSubHollows] = useState<Ihollow[]>([])

    const { currentArticleId, handleIdChange, refetchTrigger, handleRefetchTrigger } = useContext(articleContext)
    const { handleConfirmWindow, handleEditWindow } = useContext(UIContext)

    const currentUser: Iuser = session? { ...session.user } : {
        name: '', email: '', account: '', role: ''
    }
    const currentUserId = currentUser.id || 0
    // 關注的 fetch hook
    const { hollowRecordTrigger, getHollowRecordIsMutating } = useHollowRecord({onSuccessCallback})


    // 抓取一包關注的樹洞
    const { trigger: getSubHollowsTrigger, data: getSubHollowsData, error: getSubHollowsError } = useSWRMutation<successResult, Error>(`user/${currentUserId}/subscriptions`, fetchGetUserSubs);
    // 抓取一包樹洞
    const { trigger: hollowsTrigger, data: hollowsData, error: hollowsError } = useSWRMutation<successResult, Error>(`hollow`, fetchHotHollows);
    // 新增一個樹洞
    const { trigger: addHollowTrigger, isMutating: addHollowIsMutating, data: addedHollowData, error: addedHollowError } = useSWRMutation<successResult, Error>(`hollow`, fetchAddHollow, { onSuccess: (data: successResult) => { 
        // const payload = data.payload as Ihollow
        hollowsTrigger(arg)
    }});

    function onSuccessCallback (data: successResult) {
        getSubHollowsTrigger(arg)
        hollowsTrigger(arg)
    }

    useEffect(() => {
        if (!currentUserId) return
        hollowsTrigger(arg)
        getSubHollowsTrigger(arg)
    }, [hollowsTrigger, getSubHollowsTrigger, currentUserId])

    // 抓回來一整包的樹洞資料
    useEffect(() => {
        if (!currentUserId || !hollowsData) return
        const hollowRows = hollowsData?.payload as rows
        const hollowDatas = hollowRows.rows as Ihollow[]
        const hollows = formattedHollows(currentUserId, hollowDatas)
        setHollows(hollows)
    }, [currentUserId, hollowsData])
    // 抓回來一整包的關注樹洞資料
    useEffect(() => {
        if (!currentUserId || !getSubHollowsData) return
        const payload = getSubHollowsData.payload as Ihollow[]
        const hollows = formattedHollows(currentUserId, payload)
        setSubHollows(hollows)
    }, [currentUserId, getSubHollowsData])

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
    return (
        <>
            <div className='mt-20 mx-2 w-full md:mx-auto md:w-4/5 lg:w-3/5'>
                <h1 className='text-3xl font-bold'>Hollow</h1>
                <input className='border w-60 h-10 px-4 outline-0' type="text" placeholder='請輸入樹洞名稱'/>

                <h1 className='text-2xl font-bold'>關注的樹洞</h1>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                    {subHollows && subHollows.map(hollow => {
                        return (
                            <Link href={`/hollows/${hollow.id}`} key={hollow.id}>
                                <HollowCard hollow={hollow} handleSub={handleSub} />
                            </Link>
                        )
                    })}
                </div>

                <h1 className='text-2xl font-bold'>最近去過的樹洞</h1>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                    {/* {dummyHollows && dummyHollows.map(hollow => {
                        return (
                            <Link href={`/hollows/${hollow.id}`} key={hollow.id}>
                                <HollowCard hollow={hollow}/>
                            </Link>
                        )
                    })} */}
                </div>

                <h1 className='text-2xl font-bold'>所有樹洞</h1>
                <div className='grid grid-cols-1 gap-4'>
                    {hollows && hollows.map(hollow => {
                        return (
                            <Link href={`/hollows/${hollow.id}`} key={hollow.id}>
                                <HollowCard hollow={hollow} handleSub={handleSub} />
                            </Link>
                        )
                    })}
                </div>
            </div>
        </>
    )
}