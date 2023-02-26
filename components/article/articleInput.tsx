import { useRouter } from 'next/router'
import { use, useEffect, useState } from 'react'
import { Ihollow, Iarticle, Iuser } from '../../type-config'
import hollowStyle from '../../styles/hollow.module.css';
import articleStyle from '../../styles/article.module.css';
import HollowCreatePanel from '../hollow/hollowCreatePanel';

interface hollowProps {
    currentHollow?: Ihollow
    hollows: Ihollow[]
    handleAddArt: (article: Iarticle) => void
    currentUser?: Iuser
    handleHollowPanel: () => void
    handleKeyword: (keyword: string) => void
    keyHollows: Ihollow[]
}
const CONTENT_MAX = 800
const TITLE_MAX = 50

export default function ArticleInput ({ currentHollow, hollows, handleAddArt, currentUser, handleHollowPanel, handleKeyword, keyHollows }: hollowProps) {
    const [title, setTitle] = useState<string>('')
    const [content, setContent] = useState<string>('')

    const [selectHollow, setSelectHollow] = useState<Ihollow>()
    const [article, setArticle] = useState<Iarticle>({
        title: '',
        hollow_id: 0,
        user_id: 0,
        content: '',
        commentCounts: 0,
        collectedCounts: 0,
        likedCounts: 0,
        reportedCounts: 0,
        hollowName: '',
        description: '',
        adultOnly: false
    })
    useEffect(() => {
        if (!currentHollow) return
        setSelectHollow(currentHollow)
    }, [currentHollow])

    useEffect(() => {
        if (!hollows || hollows.length === 0) return
        setSelectHollow(hollows[0])
        setArticle(article => ({ ...article, hollow_id: hollows[0]?.id ?? 0, hollowName: hollows[0]?.name ?? '' }))
    }, [hollows])

    function handleSelect (hollow: Ihollow) {
        if (!hollow.id) return
        setSelectHollow(hollow)
        setArticle({...article, hollow_id: hollow.id, hollowName: hollow.name})
    }
    function handleTitleChange (event: React.FormEvent<HTMLInputElement>) {
        const value = event.currentTarget.value
        if (title.length >= TITLE_MAX) return setTitle(value.slice(0, TITLE_MAX))
        setTitle(value)
        setArticle({...article, title: value.trim().slice(0, TITLE_MAX) || ''})
    }
    function handleContentChange (event: React.FormEvent<HTMLTextAreaElement>) {
        const value = event.currentTarget.value
        const des = value.trim().length < 10? value : value.trim().slice(0, 10) + '...'
        if (content.length >= TITLE_MAX) return setContent(value.slice(0, CONTENT_MAX))
        setContent(value)
        setArticle({...article, content: value.trim(), description: des})
    }
    function handleSubmit (e: React.MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        if (!title || !content) return
        if (!currentUser?.id) return
        handleAddArt({ ...article, user_id: currentUser.id, title: title})
        setTitle('')
        setContent('')
        setArticle({...article, title: '', content: '', description: ''})
    }
    // 防抖
    const debouncedCallback = debounce((value) => {
        handleKeyword(value)
    }, 1000)
    function handleKeywordChange (event: React.FormEvent<HTMLInputElement>) {
        const value = event.currentTarget.value.trim()
        debouncedCallback(value)
    }
    function debounce (callback: (text: string) => void, time: number) {
        let timer: NodeJS.Timeout
        return (text: string) => {
            clearTimeout(timer)
            timer = setTimeout(() => { 
                callback(text)
            }, time)
        }
    }
    const hollowsWithoutCurrent: Ihollow[] = hollows.filter(hollow => hollow.id !== selectHollow?.id && hollow.id !== currentHollow?.id)
    const keyHollowsWithoutCurrent: Ihollow[] = keyHollows && keyHollows.filter(hollow => hollow.id !== selectHollow?.id && hollow.id !== currentHollow?.id)
    
    return (
        <main className='w-full relative'>
            
            {!currentUser?.id && <div className='z-0 absolute inset-0'>
                <div className='z-0 absolute inset-5 bg-black opacity-50 flex items-center rounded-md'>
                    <p className='w-full text-center text-lg text-slate-300'>請先登入</p>
                </div>
            </div>}
            <input 
                className='block w-11/12 h-12 m-auto outline-0 mt-2'
                value={title}
                onChange={handleTitleChange} 
                placeholder='標題' type="text" />
            {title.length < TITLE_MAX && <p className='absolute top-8 right-6 text-sm text-gray-300'>{title.length}/{TITLE_MAX}</p>}
            {title.length >= TITLE_MAX && <p className='absolute top-8 right-6 text-sm text-red-400'>{title.length}/{TITLE_MAX}</p>}

            <textarea 
                className='border-t resize-none w-11/12 h-24 m-auto block py-2 outline-0'
                value={content} 
                onChange={handleContentChange} 
                name="" id="" placeholder='向樹洞說說話'>
            </textarea>
            {content.length < CONTENT_MAX && <p className='absolute top-32 right-6 text-sm text-gray-300'>{content.length}/{CONTENT_MAX}</p>}
            {content.length >= CONTENT_MAX && <p className='absolute top-32 right-6 text-sm text-red-400'>{content.length}/{CONTENT_MAX}</p>}

            <div className='w-full border-t py-2 pl-8 pr-4 flex flex-col mt-1'>
                
                <div className='flex flex-wrap'>
                    {selectHollow?.name && <button className='border-lime-500 text-lime-500 border rounded-full m-1 px-3 h-10' disabled>{selectHollow.name}</button>}

                    {currentHollow && <button 
                    onClick={() => {handleSelect(currentHollow)}}
                    className='border-blue-200 text-cyan-700 border rounded-full m-1 px-3 h-10 hover:bg-sky-100 ease-out duration-300'>{currentHollow.name}</button>}

                    {/* 如果有搜尋關鍵字的話就只顯示結果樹洞 */}
                    {keyHollowsWithoutCurrent && keyHollowsWithoutCurrent.map(hollow => {
                        return (
                            <button className={hollowStyle.hollow_button} key={hollow.id} onClick={() => {handleSelect(hollow)}}>
                                <p>{hollow.name}</p>
                            </button>
                        )
                    })}
                    {keyHollowsWithoutCurrent.length === 0 && hollowsWithoutCurrent && hollowsWithoutCurrent.map(hollow => {
                        return (
                            <button className={hollowStyle.hollow_button} key={hollow.id} onClick={() => {handleSelect(hollow)}}>
                                <p>{hollow.name}</p>
                            </button>
                        )
                    })}
                </div>

                <div className='flex '>

                    <div className='flex-1 flex items-center flex-col sm:flex-row'>
                        <input onChange={handleKeywordChange} className='outline-0 w-48 h-8 px-2 border-b' placeholder='搜尋樹洞' type="text" />
                        <div>
                            <span className='text-sm text-slate-300 px-2'>沒有適合的樹洞？</span>
                            <button onClick={handleHollowPanel} className='inline text-sm text-slate-500 px-2 py-1 rounded-full hover:bg-sky-100 ease-out duration-300'>挖掘樹洞</button>
                        </div>
                    </div>

                    <button className={articleStyle.confirm_button} type="button" disabled={!title || !content} onClick={handleSubmit}>送出</button>
                </div>
            </div>
        </main>
    )
}