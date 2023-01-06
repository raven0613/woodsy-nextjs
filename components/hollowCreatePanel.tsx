import { useRouter } from 'next/router'
import { useState, useRef } from 'react'
import { Ihollow } from '../pages/index'
import { Iuser } from '../pages/index'
import Link from 'next/link'

interface HollowCreateProps {
  hollows: Ihollow[],
  currentUser: Iuser
}

export default function HollowCreatePanel ({ hollows, currentUser }: HollowCreateProps) {
    const [inputVal, setInputVal] = useState<string>('')
    const [hollow, setHollow] = useState<Ihollow>({
        id: '',
        name: '',
        article: 0,
        isSub: false,
        subCounts: 0,
        createdAt: '20230106',
    })
    const [sameHollows, setSameHollows] = useState<Ihollow[]>([])
    const [existHollow, setExistHollow] = useState<Ihollow | null>(null)

    //得到 input 值存進 hollow
    function handleInputHollow (event: React.FormEvent<HTMLInputElement>) {
        
        setInputVal(event.currentTarget.value.trim())
        setHollow({...hollow, name: event.currentTarget.value.trim()})
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
    return (
        <div>
            <p>挖掘一個樹洞</p>
            <p>樹洞名稱</p>

            {existHollow && 
                <div>
                    <p>這個樹洞已經存在，您可以點選前往該樹洞</p> 
                    <Link href={`/hollows/${existHollow.id}`} key={existHollow.id}>
                        <button>{existHollow.name}</button>
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
                                <button>{hollow.name}</button>
                            </Link>
                        )
                    })}
                </div>
            </div>}

            <input
                value={inputVal}
                onChange={e => {
                    handleInputHollow(e)
                    handleCheckExist(e)
                }}
                placeholder='請輸入樹洞名稱' type="text" />

            <button onClick={() => {
                console.log('132')
                setInputVal('')
            }}>送出</button>
        </div>
    )
}