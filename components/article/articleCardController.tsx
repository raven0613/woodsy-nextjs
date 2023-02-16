import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Iarticle, Iuser } from '../../type-config'
import MoreWindow from '../moreWindow'
import ArticleCard from './articleCard'
import ArticleDetailCard from './articleDetailCard'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Link from 'next/link'
dayjs.extend(relativeTime)

type props = {
  article: Iarticle
  moreShowingId: string
  handleClickMore: (artId: string) => void
  handleClickDelete: () => void
  handleCloseMore: () => void
  handleCollect: (articleId: number, isCollected: boolean) => void
  handleLike: (articleId: number, commentId: number, isLiked: boolean) => void
  handleEdit: (article: Iarticle) => void
  currentUser?: Iuser
  isDetail: boolean
}

export default function ArticleCardController ({ currentUser, article, moreShowingId, handleClickMore, handleClickDelete, handleCloseMore, handleCollect, handleLike, handleEdit, isDetail }: props) {
    // console.log(article)
    const [isCardShowMore, setIsCardShowMore] = useState<boolean>(false)
    const id = article.id

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

    function handleClickMoreBtn () {
        if (!article.id) return
        setIsCardShowMore(true)
        handleClickMore(`a${article.id}`)
    }
    function handleClickEdit () {
        // setIsEditing(true)
        handleEdit(article)
        setIsCardShowMore(false)
    }
    function handleClickCollect () {
        if (!id) return

        handleCollect(id, isCollected)
        setIsCollected(!isCollected)
    }
    function handleClickLike () {
        if (!id) return
        handleLike(id, 0, isLiked)
        setIsLiked(!isLiked)
    }
    return (
        <>
            {!isDetail && <ArticleCard 
            article={article}
            isCardShowMore={isCardShowMore}
            handleClickEdit={handleClickEdit}
            handleClickMoreBtn={handleClickMoreBtn}
            handleClickLike={handleClickLike}
            handleClickCollect={handleClickCollect}
            handleClickDelete={handleClickDelete} 
            handleCloseMore={handleCloseMore} />}

            {isDetail && <ArticleDetailCard 
            article={article}
            isCardShowMore={isCardShowMore}
            handleClickEdit={handleClickEdit}
            handleClickMoreBtn={handleClickMoreBtn}
            handleClickLike={handleClickLike}
            handleClickCollect={handleClickCollect}
            handleClickDelete={handleClickDelete} 
            handleCloseMore={handleCloseMore} />}
        </>
    )
}
