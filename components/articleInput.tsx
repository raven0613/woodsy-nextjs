import { useRouter } from 'next/router'
import { useState } from 'react'
import { flushSync } from 'react-dom';
import { Ihollow } from '../pages/index'
import { Iarticle } from '../pages/index'
import { Iuser } from '../pages/index'

interface hollowProps {
  hollows: Ihollow[],
  handleAddArt: (article: Iarticle) => void,
  currentUser: Iuser
}


export default function ArticleInput ({ hollows, handleAddArt, currentUser }: hollowProps) {
    const [idNum, setIdNum] = useState<number>(5)
    const [inputVal, setInputVal] = useState<string>('')
    const [textVal, setTextVal] = useState<string>('')
    
    const [selectedHollow, setSelectHollow] = useState<Ihollow | null>(null)
    const [article, setArticle] = useState<Iarticle>({
        id: `a${idNum}`,
        title: '',
        hollowId: '',
        userId: currentUser.id,
        content: '',
        comments: 0,
        collectedCounts: 0,
        likedCounts: 0,
        unlikedCounts: 0,
        isCollected: false,
        isLiked: false,
        createdAt: '20230106',
        hollowName: '',
        description: ''
    })

    function handleSelect (hollow: Ihollow) {
        setSelectHollow(hollow)
        setArticle({...article, hollowId: hollow.id, hollowName: hollow.name})
    }
    function handleInputChange (event: React.FormEvent<HTMLInputElement>) {
        if (!event.currentTarget.value.trim()) return
        setInputVal(event.currentTarget.value.trim())
        setArticle({...article, title: event.currentTarget.value.trim() || ''})
    }
    function handleContentChange (event: React.FormEvent<HTMLTextAreaElement>) {
        if (!event.currentTarget.value.trim()) return

        const des = article.content.length < 10? article.content : article.content.trim().slice(0, 10) + '...'
        setTextVal(event.currentTarget.value.trim())
        setArticle({...article, content: event.currentTarget.value.trim(), description: des})
    }

    return (
        <>
            <p>向樹洞說說話</p>
            <input 
                value={inputVal}
                onChange={handleInputChange} 
                placeholder='請輸入標題' type="text" />

            <textarea value={textVal} onChange={handleContentChange} name="" id="" cols={30} rows={10}></textarea>

            <p>選擇樹洞</p>
            {selectedHollow && <div>{selectedHollow.name}</div>}

            <input placeholder='請輸入樹洞名稱' type="text" />

            {hollows && hollows.map(hollow => {
                return (
                    <button key={hollow.id} onClick={() => {handleSelect(hollow)}}>
                        <div >{hollow.name}</div>
                    </button>
                )
            })}
            <button onClick={() => {
                setArticle({...article, id: `a${idNum + 1}`})
                handleAddArt(article)
                setInputVal('')
                setTextVal('')
                setIdNum(pre => pre + 1)
            }}>送出</button>
        </>
    )
}