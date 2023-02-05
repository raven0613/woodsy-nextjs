import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Iarticle, Iuser } from '../../type-config'
import MoreWindow from '../moreWindow'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Link from 'next/link'
dayjs.extend(relativeTime)

type props = {
  article: Iarticle
  moreShowingId: string
  handleClickMore: (artId: string) => void
  handleDeleteArt: (articleId: number) => void
  handleCloseMore: () => void
  handleCollect: (articleId: number, isCollected: boolean) => void
  handleLike: (articleId: number, isLiked: boolean) => void
  currentUser: Iuser
}

export default function ArticleCard ({ currentUser, article, moreShowingId, handleClickMore, handleDeleteArt, handleCloseMore, handleCollect, handleLike }: props) {
    // console.log(article)
    const [isCardShowMore, setIsCardShowMore] = useState<boolean>(false)
    const id = article.id
    const [isEditing, setIsEditing] = useState<boolean>(false)

    const isLikedFromParent = article.isLiked
    const isCollectedFromParent = article.isCollected
    const [isLiked, setIsLiked] = useState<boolean>(isLikedFromParent || false)
    const [isCollected, setIsCollected] = useState<boolean>(isCollectedFromParent || false)

    useEffect(() => {
        if (!isLikedFromParent) return
        setIsLiked(isLikedFromParent)
    }, [isLikedFromParent])
    useEffect(() => {
        if (!isCollectedFromParent) return
        setIsCollected(isCollectedFromParent)
    }, [isCollectedFromParent])

    useEffect(() => {
        if (moreShowingId !== `a${id}`) {
            setIsCardShowMore(false)
        } 
    }, [moreShowingId, id])

    function handleClickMoreBtn (e: React.MouseEvent) {
        e.stopPropagation()
        e.preventDefault()
        if (!article.id) return
        setIsCardShowMore(true)
        handleClickMore(`a${article.id}`)
    }
    function handleEdit (article: Iarticle) {
        setIsEditing(true)
    }
    function handleDelete () {
        if (!article.id) return
        handleDeleteArt(article.id)
    }
    function handleClickCollect (e: React.MouseEvent) {
        if (!id) return
        e.stopPropagation()
        e.preventDefault()

        handleCollect(id, isCollected)
        setIsCollected(!isCollected)
    }
    function handleClickLike (e: React.MouseEvent) {
        if (!id) return
        e.stopPropagation()
        e.preventDefault()

        handleLike(id, isLiked)
        setIsLiked(!isLiked)
    }
    return (
        <div className='m-auto border bg-gray-0 py-3 px-5 mb-4 rounded-lg flex flex-col'>
            <div className='pb-2 border-b flex items-center relative'>
                <span className='text-gray-600 text-lg font-bold leading-8 h-8'>{article.User?.name}</span>
                <span className='text-gray-400 text-sm pl-4 leading-8 h-8 flex-1'>{dayjs(article.createdAt).fromNow()}</span>
                {!isCardShowMore && <button className='w-8 h-8 border justify-end rounded-full' onMouseUp={handleClickMoreBtn}>…</button>}
                {isCardShowMore && <MoreWindow 
                handleEdit={handleEdit} 
                handleDelete={handleDelete}
                handleCloseMore={handleCloseMore} 
                id={id? id : 0}/>}
            </div>

            <Link href={`/articles/${article.id}`} className='pt-2'>
                <p className='text-gray-600 text-lg font-bold'>{article.title}</p>
                <p className='text-gray-400 text-base pt-2 whitespace-pre-wrap' >{article.description}</p>
            </Link>

            <div className='pt-4'>
                <Link href={`/hollows/${article.hollow_id}`}>
                    <span className='border rounded-full border-lime-500 text-lime-500 px-3 py-1.5 flex-1'>{article.Hollow?.name}</span>
                </Link>

                <button className='px-2 ml-2'>回應{article.commentCounts}</button>

                {article.isLiked && <button className='px-2 ml-2 text-red-500' onClick={handleClickLike}>讚{article.likedCounts}</button>}
                {!article.isLiked && <button className='px-2 ml-2' onClick={handleClickLike}>讚{article.likedCounts}</button>}
                
                {article.isCollected &&<button className='text-red-500 h-8 justify-end px-2 ml-2' onClick={handleClickCollect}>收藏{article.collectedCounts}</button>}
                {!article.isCollected &&<button className='h-8 justify-end px-2 ml-2' onClick={handleClickCollect}>收藏{article.collectedCounts}</button>}
            </div>
        </div>
    )
}
