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
    handleDeleteComment: (commentId: number) => void,
    handleEditComment: (comment: Icomment) => void
    moreShowingId: string
    handleClickMore: (artId: string) => void
    handleCloseMore: () => void
    handleLike: (articleId: number, commentId: number, isLiked: boolean) => void
}

export default function CommentCardController ({ comment, handleDeleteComment, handleEditComment, handleClickMore, moreShowingId, handleCloseMore, handleLike }: commentProps) {
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [content, setContent] = useState<string>(comment.content)
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
    }

    function handleClickDelete () {
        if (!id) return
        handleDeleteComment(id)
    }
    function handleClickLike () {
        if (!id) return
        handleLike(0, id, isLiked)
        setIsLiked(!isLiked)
    }
    function handleSubmit () {
        if (!content) {
            setIsEditing(false)
            setContent(comment.content)
            return
        }
        if (content === comment.content) {
            setIsEditing(false)
            return
        }
        let editedComment = { ...comment, content }
        handleEditComment(editedComment)
        setIsEditing(false)
    }

    function handleCancel () {
        setIsEditing(false)
        setContent(comment.content)
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