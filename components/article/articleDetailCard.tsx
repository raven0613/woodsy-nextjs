import { useRouter } from 'next/router'
import { useState } from 'react'
import { Iarticle } from '../../type-config'

interface articleProps {
  article: Iarticle
  handleDeleteArt: (articleId: number) => void
}

export default function ArticleDetailCard ({ article, handleDeleteArt }: articleProps) {
    const [isEditing, setIsEditing] = useState<boolean>(false)
    

    function handleEdit () {
        setIsEditing(true)
    }
    function handleDelete (articleId: number) {
        handleDeleteArt(articleId)
    }
    return (
        <div className='m-auto bg-gray-50 py-3 px-5 my-3 rounded-lg'>
            <h1 className='text-2xl font-semibold '>{article.title}</h1>
            <article className='whitespace-pre-wrap'>{article.content}</article>

            {!isEditing && <button onClick={handleEdit}>編輯</button>}
            <button onClick={() => {
                if (!article.id) return
                handleDelete(article.id)
            }}>刪除</button>
        </div>
    )
}