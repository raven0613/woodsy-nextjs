import { useRouter } from 'next/router'
import { useState, useRef } from 'react'
import { Ihollow, Iuser } from '../../type-config'
import Link from 'next/link'
import hollowStyle from '../../styles/hollow.module.css';
import articleStyle from '../../styles/article.module.css';

interface HollowCreateProps {
  hollows: Ihollow[],
  currentUser: Iuser,
  handleAddHollow: (hollow: Ihollow) => void,
}

export default function HollowCreatePanel ({ hollows, currentUser, handleAddHollow }: HollowCreateProps) {
    const [inputVal, setInputVal] = useState<string>('')
    const [hollow, setHollow] = useState<Ihollow>({
        name: '',
        type: 'public',
        user_id: currentUser.id,
    })
    const [sameHollows, setSameHollows] = useState<Ihollow[]>([])
    const [existHollow, setExistHollow] = useState<Ihollow | null>(null)

    //得到 input 值存進 hollow
    function handleInputHollow (event: React.FormEvent<HTMLInputElement>) {
        const value = event.currentTarget.value.trim()
        setInputVal(value)
        setHollow({...hollow, name: value})
    }
    function handleCheckExist (event: React.FormEvent<HTMLInputElement>) {
        if (!event.currentTarget.value.trim()) {
            setSameHollows([])
            setExistHollow(null)
            return
        }
        //找類似
        const existList: Ihollow[] = hollows.filter(h => h.name.includes(event.currentTarget.value.trim()))
        setSameHollows(existList)

        //找相同
        const exist: Ihollow | null = hollows.find(h => h.name === event.currentTarget.value.trim()) || null
        setExistHollow(exist)
    }
    function handleSubmit (e: React.MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        if (!currentUser) return
        if (!inputVal) return
        setInputVal('')
        setHollow({...hollow, name: ''})
        handleAddHollow({...hollow, user_id: currentUser.id})
    }
    return (
        <div className='w-11/12 m-auto py-4'>
            <p>挖掘一個樹洞</p>

            {existHollow && 
                <div>
                    <p>這個樹洞已經存在，您可以點選前往該樹洞</p> 
                    <Link href={`/hollows/${existHollow.id}`} key={existHollow.id}>
                        <button className={hollowStyle.hollow_button}>{existHollow.name}</button>
                    </Link>
                </div>
            }

            {!!sameHollows.length && !existHollow && <div>
                <p>相似樹洞</p>
                <p>點選以前往</p>
                <div>
                    {sameHollows.map(hollow => {
                        return (
                            <Link href={`/hollows/${hollow.id}`} key={hollow.id}>
                                <button className={hollowStyle.hollow_button}>{hollow.name}</button>
                            </Link>
                        )
                    })}
                </div>
            </div>}

            <input
                className='outline-0 border w-64 h-12 px-2.5 rounded-md mr-3'
                value={inputVal}
                onChange={e => {
                    handleInputHollow(e)
                    handleCheckExist(e)
                }}
                placeholder='請輸入樹洞名稱' type="text" />

            {inputVal && <button className={articleStyle.confirm_button} onClick={handleSubmit} >送出</button>}
            {!inputVal && <button className={articleStyle.confirm_button_disabled} disabled={!inputVal}>送出</button>}
        </div>
    )
}