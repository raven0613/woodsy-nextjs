import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Iarticle } from '../../type-config'
import MoreWindow from '../moreWindow'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)


type props = {
    article: Iarticle
    isCardShowMore: boolean
    handleClickMoreBtn: () => void
    handleClickEdit: () => void
    handleClickLike: () => void
    handleClickCollect: () => void
    handleClickDelete: () => void
    handleCloseMore: () => void
}

export default function ArticleDetailCard ({ article, isCardShowMore, handleClickMoreBtn, handleClickEdit, handleClickLike, handleClickCollect, handleClickDelete, handleCloseMore }: props) {
    const id = article.id

    function onClickMoreBtn (e: React.MouseEvent) {
        e.stopPropagation()
        e.preventDefault()
        handleClickMoreBtn()
    }
    function onClickCollect (e: React.MouseEvent) {
        if (!id) return
        e.stopPropagation()
        e.preventDefault()
        handleClickCollect()
        // setIsCollected(!isCollected)
    }
    function onClickLike (e: React.MouseEvent) {
        if (!id) return
        e.stopPropagation()
        e.preventDefault()
        handleClickLike()
        // setIsLiked(!isLiked)
    }

    return (
        <div className='w-full m-auto border py-3 px-5 my-3 rounded-lg'>

            <div className='w-full flex relative items-center border-b'>
                <h1 className='text-xl font-semibold py-2 flex-1'>{article.title}</h1>
                {!isCardShowMore && <button className='w-8 h-8 border rounded-full' onClick={onClickMoreBtn}>…</button>}
                {isCardShowMore && <MoreWindow 
                handleClickEdit={handleClickEdit}
                handleClickDelete={handleClickDelete}
                handleCloseMore={handleCloseMore}
                id={id? id : 0}/>}
            </div>

            <article className='whitespace-pre-wrap py-2'>{article.content}</article>

            <div className='pt-4 w-full flex'>
                <button className='px-2 ml-2'>回應{article.commentCounts}</button>

                {article.isLiked && <button className='px-2 ml-2 text-red-500' onClick={onClickLike}>讚{article.likedCounts}</button>}
                {!article.isLiked && <button className='px-2 ml-2' onClick={onClickLike}>讚{article.likedCounts}</button>}
                
                {article.isCollected &&<button className='text-red-500 h-8 justify-end px-2 ml-2' onClick={onClickCollect}>收藏{article.collectedCounts}</button>}
                {!article.isCollected &&<button className='h-8 justify-end px-2 ml-2' onClick={onClickCollect}>收藏{article.collectedCounts}</button>}

                <p className='text-gray-400 text-sm pr-4 leading-8 h-8 flex-1 text-right'>{dayjs(article.createdAt).fromNow()}</p>
            </div>
        </div>
    )
}