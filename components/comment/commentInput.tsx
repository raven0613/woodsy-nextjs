import { useRouter } from 'next/router'
import { useState } from 'react'
import { Iarticle, Icomment, Iuser } from '../../type-config'

interface IcommentProps {
  handleAddComment: (article: Icomment) => void,
  currentUser?: Iuser
  article: Iarticle
}

export default function CommentInput ({ handleAddComment, currentUser, article }: IcommentProps) {
    const [textVal, setTextVal] = useState<string>('')
    const [comment, setComment] = useState<Icomment>({
        id: 0,
        article_id: article.id || 0,
        user_id: currentUser?.id || 0,
        User: {
            id: currentUser?.id || 0,
            name: currentUser?.name || 'user'},
        content: '',
        likedCounts: 0,
        reportedCounts: 0,
        isLiked: false,
        description: ''
    })

    function handleContentChange (event: React.FormEvent<HTMLTextAreaElement>) {
        const value = event.currentTarget.value
        const des = value.trim().length < 10? value : value.trim().slice(0, 10) + '...'
        setTextVal(event.currentTarget.value)
        setComment({...comment, content: event.currentTarget.value.trim(), description: des})
    }

    function handleSubmit (e: React.MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        if (!comment.content) return console.log('沒有內容')
        handleAddComment(comment)
        setTextVal('')
        setComment({...comment, content: '', description: ''})
    }

    return (
        <div className='mx-auto w-full h-24 border flex'>
            <textarea 
                className='border h-full m-auto resize-none px-2 py-1 flex-1 outline-0'
                placeholder='請輸入你的回音'
                value={textVal} 
                onChange={handleContentChange} 
                name="" id="">
            </textarea>

            <button className='m-auto w-24 h-10 leading-10 border' type="button" onClick={handleSubmit}>送出</button>
        </div>
    )
}