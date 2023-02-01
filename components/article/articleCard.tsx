import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Iarticle } from '../../type-config'
import MoreWindow from '../moreWindow'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

interface articleProps {
  art: Iarticle
  moreShowingId: number
  handleClickMore: (artId: number) => void
}

export default function ArticleCard ({ art, moreShowingId, handleClickMore }: articleProps) {
    console.log(art)
    const [isCardShowMore, setIsCardShowMore] = useState<boolean>(false)
    const id = art.id

    useEffect(() => {
        if (moreShowingId !== id) {
            setIsCardShowMore(false)
        } 
    }, [moreShowingId, id])

    function handleClickMoreBtn (e: React.MouseEvent) {
        e.stopPropagation()
        e.preventDefault()
        if (!art.id) return
        setIsCardShowMore(true)
        handleClickMore(art.id)
    }
    function handleCollect (e: React.MouseEvent) {
        e.stopPropagation()
        e.preventDefault()
    }
    return (
        <div className='m-auto border bg-gray-0 py-3 px-5 mb-4 rounded-lg flex flex-col'>
            <div className='pb-2 border-b flex items-center relative'>
                <span className='text-gray-600 text-lg font-bold leading-8 h-8'>{art.User?.name}</span>
                <span className='text-gray-400 text-sm pl-4 leading-8 h-8 flex-1'>{dayjs(art.createdAt).fromNow()}</span>
                {!isCardShowMore && <button className='w-8 h-8 border justify-end rounded-full' onClick={handleClickMoreBtn}>…</button>}
                {isCardShowMore && <MoreWindow id={id? id : 0}/>}
            </div>

            <div className='pt-2'>
                <p className='text-gray-600 text-lg font-bold'>{art.title}</p>
                <p className='text-gray-400 text-base pt-2'>{art.description}</p>
            </div>

            <div className='pt-4'>
                <span className='border rounded-full border-lime-500 text-lime-500 px-1.5 py-0.5 flex-1'>{art.hollowName}</span>
                <button className='px-2 ml-2'>回應數：{art.commentCounts}</button>
                <button className='px-2 ml-2'>讚數：{art.likedCounts}</button>
                <button className='h-8 justify-end px-2 ml-2' onClick={handleCollect}>收藏數：{art.collectedCounts}</button>

            </div>
        </div>
    )
}
