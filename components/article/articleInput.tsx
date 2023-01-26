import { useRouter } from 'next/router'
import { useState } from 'react'
import { flushSync } from 'react-dom';
import { Ihollow, Iarticle, Iuser } from '../../pages/home'


interface hollowProps {
  hollows: Ihollow[],
  handleAddArt: (article: Iarticle) => void,
  currentUser: Iuser
}


export default function ArticleInput ({ hollows, handleAddArt, currentUser }: hollowProps) {
    const [idNum, setIdNum] = useState<number>(5)
    const [inputVal, setInputVal] = useState<string>('')
    const [textVal, setTextVal] = useState<string>('')
    
    const [selectHollow, setSelectHollow] = useState<Ihollow | null>(null)
    const [article, setArticle] = useState<Iarticle>({
        id: `a${idNum}`,
        title: '',
        hollowId: '',
        userId: currentUser.id,
        content: '',
        comments: 0,
        collectedCounts: 0,
        likedCounts: 0,
        reportedCounts: 0,
        isCollected: false,
        isLiked: false,
        reportedAt: '20230106',
        createdAt: '20230106',
        hollowName: '',
        description: ''
    })

    function handleSelect (hollow: Ihollow) {
        setSelectHollow(hollow)
        setArticle({...article, hollowId: hollow.id, hollowName: hollow.name})
    }
    function handleInputChange (event: React.FormEvent<HTMLInputElement>) {
        setInputVal(event.currentTarget.value)
        setArticle({...article, title: event.currentTarget.value.trim() || ''})
    }
    function handleContentChange (event: React.FormEvent<HTMLTextAreaElement>) {
        const value = event.currentTarget.value
        const des = value.trim().length < 10? value : value.trim().slice(0, 10) + '...'
        setTextVal(event.currentTarget.value)
        setArticle({...article, content: event.currentTarget.value.trim(), description: des})
    }
    function handleSubmit (e: React.MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        handleAddArt(article)
        setInputVal('')
        setTextVal('')
        setArticle({...article, id: `a${idNum + 1}`, title: '', content: '', description: ''})
        setIdNum(pre => pre + 1)
    }

    return (
        <div className='w-full'>
            <p>向樹洞說說話</p>
            <input 
                className='border'
                value={inputVal}
                onChange={handleInputChange} 
                placeholder='請輸入標題' type="text" />

            <textarea 
                className='border'
                value={textVal} 
                onChange={handleContentChange} 
                name="" id="" cols={80} rows={8}>
            </textarea>

            <p>選擇樹洞</p>
            {selectHollow && <div>{selectHollow.name}</div>}

            <input placeholder='請輸入樹洞名稱' type="text" />

            {hollows && hollows.map(hollow => {
                return (
                    <button key={hollow.id} onClick={() => {handleSelect(hollow)}}>
                        <div >{hollow.name}</div>
                    </button>
                )
            })}
            <button type="button" onClick={handleSubmit}>送出</button>
        </div>
    )
}