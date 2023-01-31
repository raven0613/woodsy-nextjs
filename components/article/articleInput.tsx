import { useRouter } from 'next/router'
import { useState } from 'react'
import { flushSync } from 'react-dom';
import { Ihollow, Iarticle, Iuser } from '../../type-config'


interface hollowProps {
  hollows: Ihollow[],
  handleAddArt: (article: Iarticle) => void,
  currentUser: Iuser
}


export default function ArticleInput ({ hollows, handleAddArt, currentUser }: hollowProps) {
    const [inputVal, setInputVal] = useState<string>('')
    const [textVal, setTextVal] = useState<string>('')
    
    const [selectHollow, setSelectHollow] = useState<Ihollow | null>(null)
    const [article, setArticle] = useState<Iarticle>({
        title: '',
        hollowId: 0,
        userId: 10,
        content: '',
        commentCounts: 0,
        collectedCounts: 0,
        likedCounts: 0,
        reportedCounts: 0,
        hollowName: '',
        description: ''
    })

    function handleSelect (hollow: Ihollow) {
        if (!hollow.id) return
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
        setArticle({...article, title: '', content: '', description: ''})
    }

    return (
        <main className='w-full border rounded-lg'>
            <input 
                className='block w-11/12 h-12 m-auto outline-0 mt-2'
                value={inputVal}
                onChange={handleInputChange} 
                placeholder='標題' type="text" />

            <textarea 
                className='border-t resize-none w-11/12 h-24 m-auto block py-2 outline-0'
                value={textVal} 
                onChange={handleContentChange} 
                name="" id="" placeholder='向樹洞說說話'>
            </textarea>

            <div className='w-full border-t py-2 pl-8 pr-4 flex flex-col mt-1'>
                
                {/* {selectHollow && <div>{selectHollow.name}</div>} */}
                <div>
                    {hollows && hollows.map(hollow => {
                        return (
                            <button className='border rounded-full m-1 px-2 h-10 hover:bg-sky-100 ease-out duration-300' key={hollow.id} onClick={() => {handleSelect(hollow)}}>
                                <div >{hollow.name}</div>
                            </button>
                        )
                    })}
                </div>

                <div className='flex'>
                    <div className='flex-1 flex items-center'>
                        <input className='outline-0 w-48 h-8 px-2 border-b' placeholder='搜尋樹洞' type="text" />
                        <span className='text-sm text-slate-300 px-2'>沒有適合的樹洞？</span>
                        <button className='inline text-sm text-slate-500 px-2 py-1 rounded-full hover:bg-sky-100 ease-out duration-300'>挖掘樹洞</button>
                    </div>
                    <button className='border w-20 h-10 rounded-full hover:bg-sky-100 ease-out duration-300' type="button" onClick={handleSubmit}>送出</button>
                </div>

            </div>

        </main>
    )
}