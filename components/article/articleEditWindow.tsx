import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Iarticle } from '../../type-config'
import articleStyle from '../../styles/article.module.css';

interface props {
  article: Iarticle
  handleConfirmEdit: (article: Iarticle) => void
  handleEditWindow: (article: Iarticle) => void
}

//編輯跟預覽可以左右切換
export default function ArticleEditWindow ({ article, handleConfirmEdit, handleEditWindow }: props) {
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [title, setTitle] = useState<string>('')
    const [content, setContent] = useState<string>('')
    const [hollowId, setHollowId] = useState<number>(0)
    
    useEffect(() => {
        if (!article) return
        setTitle(article.title)
        setContent(article.content)
    }, [article])

    function onInputChange (event: React.FormEvent<HTMLInputElement>) {
        setTitle(event.currentTarget.value)
    }
    function onContentChange (event: React.FormEvent<HTMLTextAreaElement>) {
        setContent(event.currentTarget.value)
    }
    function onClickCancel (e: React.MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        // if (article.title !== title || article.content !== content) return console.log('確定要關嗎')
        handleEditWindow(article)
    }
    function onClickOk (e: React.MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        handleConfirmEdit({ ...article, title, content })
    }
    return (
        <>
            <div className='fixed z-10 right-2/4 bottom-2/4 translate-x-1/2 translate-y-1/2 w-8/12 h-96 border bg-white rounded-xl'>
                {/* <h1 className='text-2xl font-semibold '>{article.title}</h1> */}
                <input 
                    className='block w-11/12 h-12 m-auto outline-0 mt-2'
                    value={title}
                    onChange={onInputChange} 
                    placeholder='標題' type="text" />

                <textarea 
                    className='border-t resize-none w-11/12 h-24 m-auto block py-2 outline-0'
                    value={content} 
                    onChange={onContentChange} 
                    name="" id="" placeholder='向樹洞說說話'>
                </textarea>
                {/* <article className='whitespace-pre-wrap'>{article.content}</article> */}
                <button className={articleStyle.confirm_button} onClick={onClickOk}>送出</button>
                
            </div>
            <div className='fixed inset-0 z-0' onMouseDown={onClickCancel}></div>
        </>
    )
}