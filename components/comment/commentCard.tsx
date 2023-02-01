import { useRouter } from 'next/router'
import Link from 'next/link'
import { Icomment } from '../../type-config'
import { useEffect, useState } from 'react'
import MoreWindow from '../moreWindow'
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
}

export default function CommentCard ({ comment, handleDeleteComment, handleEditComment, handleClickMore, moreShowingId, handleCloseMore }: commentProps) {
    console.log(comment)
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [content, setContent] = useState<string>(comment.content)
    const [isCardShowMore, setIsCardShowMore] = useState<boolean>(false)
    const id = comment.id

    useEffect(() => {
        if (moreShowingId !== `c${id}`) {
            setIsCardShowMore(false)
        } 
    }, [moreShowingId, id])

    function handleEdit () {
        setIsEditing(true)
    }

    function handleDelete (commentId: number) {
        handleDeleteComment(commentId)
    }

    function handleContentChange (event: React.FormEvent<HTMLTextAreaElement>) {
        const value = event.currentTarget.value
        setContent(value)
    }

    function handleSubmit (e: React.MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
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

    function handleCancel (e: React.MouseEvent) {
        setIsEditing(false)
        setContent(comment.content)
    }
    function handleClickMoreBtn (e: React.MouseEvent) {
        e.stopPropagation()
        e.preventDefault()
        if (!id) return
        setIsCardShowMore(true)
        handleClickMore(`c${comment.id}`)
    }

    return (
        <div className='w-full border-b px-4 py-2'>

            <div className='w-full h-8 flex relative items-center'>
                <span className='text-base text-gray-700 pr-2'>白文鳥</span>
                <span className='text-sm text-slate-300 flex-1'>@Vg2X8</span>
                {!isCardShowMore && <button className='w-8 h-8 border rounded-full' onClick={handleClickMoreBtn}>…</button>}
                {isCardShowMore && <MoreWindow 
                handleEdit={handleEdit} 
                handleDelete={handleDelete} 
                handleCloseMore={handleCloseMore}
                id={id? id : 0}/>}
            </div>


            {!isEditing && <p className='py-2 whitespace-pre-wrap'>
                {comment.content}
            </p>}
            {isEditing && <div>
                <textarea value={content} onChange={handleContentChange} className='border'></textarea>
                <button onClick={handleSubmit}>確定</button>
                <button onClick={handleCancel}>取消</button>
            </div>}

            <div className='pt-4 w-full flex'>
                <button className=''>讚數：{comment.likedCounts}</button>
                <p className='text-gray-400 text-sm pr-4 leading-8 h-8 flex-1 text-right'>{dayjs(comment.createdAt).fromNow()}</p>
            </div>
        </div>
    )
}