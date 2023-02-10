import { useRouter } from 'next/router'
import Link from 'next/link'
import { Icomment } from '../../type-config'
import { useEffect, useState } from 'react'
import MoreWindow from '../moreWindow'
import CommentCard from './commentCard'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)


interface commentProps {
    comment: Icomment
    handleClickDelete: () => void
    handleSubmitComment: (comment: Icomment) => void
    moreShowingId: string
    handleClickMore: (id: string) => void
    handleCloseMore: () => void
    handleLike: (articleId: number, commentId: number, isLiked: boolean) => void
}

export default function CommentCardController ({ comment, handleClickDelete, handleClickMore, moreShowingId, handleCloseMore, handleLike, handleSubmitComment }: commentProps) {
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [isCardShowMore, setIsCardShowMore] = useState<boolean>(false)
    const id = comment.id
    const commentTime = dayjs(comment.createdAt).fromNow()
    const isLikedFromParent = comment.isLiked
    const [isLiked, setIsLiked] = useState<boolean>(isLikedFromParent || false)

    useEffect(() => {
        if (moreShowingId !== `c${id}`) {
            setIsCardShowMore(false)
        } 
    }, [moreShowingId, id])
    
    useEffect(() => {
        if (!isLikedFromParent) return
        setIsLiked(isLikedFromParent)
    }, [isLikedFromParent])

    function handleClickEdit () {
        setIsEditing(true)
        handleCloseMore()
    }
    function handleClickLike () {
        if (!id) return
        handleLike(0, id, isLiked)
        setIsLiked(!isLiked)
    }
    function handleSubmit (content: string) {
        if (!content) {
            setIsEditing(false)
            return
        }
        if (content === comment.content) {
            setIsEditing(false)
            return
        }
        handleSubmitComment({...comment, content})
        setIsEditing(false)
    }

    function handleCancel () {
        setIsEditing(false)
    }
    function handleClickMoreBtn () {
        if (!id) return
        setIsCardShowMore(true)
        handleClickMore(`c${comment.id}`)
    }

    return (
        <CommentCard 
        handleClickEdit={handleClickEdit}
        handleClickLike={handleClickLike}
        handleClickDelete={handleClickDelete}
        handleClickMoreBtn={handleClickMoreBtn} 
        handleCloseMore={handleCloseMore}
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
        commentTime={commentTime}
        comment={comment}
        isCardShowMore={isCardShowMore}
        isEditing={isEditing} />
    )
}