import { useRouter } from 'next/router'
import Link from 'next/link'
import { Icomment } from '../../type-config'
import { useEffect, useState } from 'react'
import MoreWindow from '../moreWindow'

interface props {
    comment: Icomment
    handleClickDelete: () => void,
    handleClickEdit: () => void
    handleClickMoreBtn: () => void
    handleCloseMore: () => void
    handleSubmit: (content: string) => void
    handleCancel: () => void
    handleClickLike: () => void
    commentTime: string
    isCardShowMore: boolean
    isEditing: boolean
}

export default function CommentCard ({ comment, handleClickDelete, handleClickLike, handleClickEdit, handleClickMoreBtn, isCardShowMore, handleCloseMore, commentTime, handleSubmit, handleCancel, isEditing }: props) {
    const [content, setContent] = useState<string>(comment.content)
    const id = comment.id

    function handleContentChange (event: React.FormEvent<HTMLTextAreaElement>) {
        const value = event.currentTarget.value
        setContent(value)
    }
    function onLike (e: React.MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        handleClickLike()
    }

    function onSubmit (e: React.MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        handleSubmit(content)
    }

    function onCancel (e: React.MouseEvent) {
        e.stopPropagation()
        e.preventDefault()
        setContent(comment.content)
        handleCancel()
    }
    function onClickMoreBtn (e: React.MouseEvent) {
        e.stopPropagation()
        e.preventDefault()
        handleClickMoreBtn()
    }

    return (
        <div className='w-full border-b px-4 py-2'>

            <div className='w-full h-8 flex relative items-center'>
                <span className='text-base text-gray-700 pr-2'>{comment.User?.name || ''}</span>
                <span className='text-sm text-slate-300 flex-1'>@Vg2X8</span>
                {!isCardShowMore && <button className='w-8 h-8 border rounded-full' onClick={onClickMoreBtn}>…</button>}
                {isCardShowMore && <MoreWindow 
                handleClickEdit={handleClickEdit} 
                handleClickDelete={handleClickDelete} 
                handleCloseMore={handleCloseMore}
                id={id? id : 0}/>}
            </div>


            {!isEditing && <p className='py-2 whitespace-pre-wrap'>
                {comment.content}
            </p>}
            {isEditing && <div>
                <textarea value={content} onChange={handleContentChange} className='border'></textarea>
                <button onClick={onSubmit}>確定</button>
                <button onClick={onCancel}>取消</button>
            </div>}

            <div className='pt-4 w-full flex'>
                {comment.isLiked && <button className='px-2 ml-2 text-red-500' onClick={onLike}>讚{comment.likedCounts}</button>}
                {!comment.isLiked && <button className='px-2 ml-2' onClick={onLike}>讚{comment.likedCounts}</button>}
                <p className='text-gray-400 text-sm pr-4 leading-8 h-8 flex-1 text-right'>{commentTime}</p>
            </div>
        </div>
    )
}