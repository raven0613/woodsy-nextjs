import { useRouter } from 'next/router'
import Link from 'next/link'
import { Icomment } from '../../type-config'
import { useState } from 'react'

interface commentProps {
    comment: Icomment
    handleDeleteComment: (commentId: number) => void,
    handleEditComment: (comment: Icomment) => void
}

export default function CommentCard ({ comment, handleDeleteComment, handleEditComment }: commentProps) {
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [content, setContent] = useState<string>(comment.content)

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

    return (
        <div className='w-full border-b px-4 py-2'>
            <span>白文鳥</span>
            <span className='text-sm text-slate-300'>@Vg2X8</span>
            {!isEditing && <p className='py-2 whitespace-pre-wrap'>
                {comment.content}
            </p>}
            {isEditing && <div>
                <textarea value={content} onChange={handleContentChange} className='border'></textarea>
                <button onClick={handleSubmit}>確定</button>
                <button onClick={handleCancel}>取消</button>
            </div>}

            {!isEditing && <button onClick={handleEdit}>編輯</button>}
            <button onClick={() => {handleDelete(comment.id)}}>刪除</button>
        </div>
    )
}