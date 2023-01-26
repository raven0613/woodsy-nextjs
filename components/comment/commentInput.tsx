import { useRouter } from 'next/router'
import { useState } from 'react'
import { Icomment, Iuser } from '../../pages/home'

interface IcommentProps {
  handleAddComment: (article: Icomment) => void,
  currentUser: Iuser
}

export default function CommentInput ({ handleAddComment, currentUser }: IcommentProps) {
    const [idNum, setIdNum] = useState<number>(4)
    const [textVal, setTextVal] = useState<string>('')
    const [comment, setComment] = useState<Icomment>({
        id: 'c04',
        articleId: 'a01',
        userId: 'u01',
        content: '',
        likedCounts: 0,
        reportedCounts: 0,
        isLiked: false,
        reportedAt: '',
        createdAt: '20230121',
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
        setComment({...comment, id: `a${idNum + 1}`, content: '', description: ''})
        setIdNum(pre => pre + 1)
    }

    return (
        <div className='mx-auto w-full h-24 border flex'>
            <textarea 
                className='border h-full m-auto resize-none px-2 py-1 flex-1'
                placeholder='請輸入你的回音'
                value={textVal} 
                onChange={handleContentChange} 
                name="" id="">
            </textarea>

            <button className='m-auto w-24 h-10 leading-10 border' type="button" onClick={handleSubmit}>送出</button>
        </div>
    )
}