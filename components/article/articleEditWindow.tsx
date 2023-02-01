import { useRouter } from 'next/router'
import { useState } from 'react'
import { Iarticle } from '../../type-config'

interface articleProps {
  article: Iarticle
}
//編輯跟預覽可以左右切換
export default function ArticleEditWindow ({ article }: articleProps) {
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [content, setContent] = useState<string>('')
    return (
        <div className='fixed right-2/4 bottom-2/4 translate-x-1/2 translate-y-1/2 w-8/12 h-96 border'>
            <h1 className='text-2xl font-semibold '>{article.title}</h1>
            <article className='whitespace-pre-wrap'>{article.content}</article>
            <div className='fixed inset-0 bg-black'></div>
        </div>
    )
}