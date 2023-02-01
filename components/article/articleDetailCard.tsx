import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Iarticle } from '../../type-config'
import MoreWindow from '../moreWindow'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)


type props = {
  article: Iarticle
  handleDeleteArt: (articleId: number) => void
  handleClickMore: (artId: string) => void
  moreShowingId: string
  handleCloseMore: () => void
}

export default function ArticleDetailCard ({ article, handleDeleteArt, moreShowingId, handleClickMore, handleCloseMore }: props) {
    // console.log(article)
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [isCardShowMore, setIsCardShowMore] = useState<boolean>(false)
    const id = article.id
    
    useEffect(() => {
        if (moreShowingId !== `a${id}`) {
            setIsCardShowMore(false)
        } 
    }, [moreShowingId, id])
    
    function handleClickMoreBtn (e: React.MouseEvent) {
        e.stopPropagation()
        e.preventDefault()
        if (!article.id) return
        setIsCardShowMore(true)
        handleClickMore(`a${article.id}`)
    }

    function handleCollect (e: React.MouseEvent) {
        e.stopPropagation()
        e.preventDefault()
    }

    function handleEdit (article: Iarticle) {
        setIsEditing(true)
    }
    function handleDelete (articleId: number) {
        if (!articleId) return
        handleDeleteArt(articleId)
    }
    return (
        <div className='w-full m-auto border py-3 px-5 my-3 rounded-lg'>

            <div className='w-full flex relative items-center border-b'>
                <h1 className='text-xl font-semibold py-2 flex-1'>{article.title}</h1>
                {!isCardShowMore && <button className='w-8 h-8 border rounded-full' onClick={handleClickMoreBtn}>…</button>}
                {isCardShowMore && <MoreWindow 
                handleEdit={handleEdit} 
                handleDelete={handleDelete} 
                handleCloseMore={handleCloseMore}
                id={id? id : 0}/>}
            </div>

            <article className='whitespace-pre-wrap py-2'>{article.content}</article>

            <div className='pt-4 w-full flex'>
                <button className='px-2 ml-2'>回應數：{article.commentCounts}</button>
                <button className='px-2 ml-2'>讚數：{article.likedCounts}</button>
                <button className='h-8 px-2 ml-2' onClick={handleCollect}>收藏數：{article.collectedCounts}</button>
                <p className='text-gray-400 text-sm pr-4 leading-8 h-8 flex-1 text-right'>{dayjs(article.createdAt).fromNow()}</p>
            </div>
        </div>
    )
}