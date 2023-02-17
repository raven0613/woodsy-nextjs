import { useRouter } from 'next/router'
import Link from 'next/link'
import { Iarticle } from '../type-config'
import { useSession, signOut } from "next-auth/react"
import { useState } from 'react'
import UserWindow from './user/userWindow'

type props = {
    id: number
}

export default function Navbar ({ id }: props) {
    const [isUserWindowOpen, setIsUserWindowOpen] = useState<boolean>(false)

    function handleClickUser () {
        setIsUserWindowOpen(!isUserWindowOpen)
    }
    function handleCloseUser () {
        setIsUserWindowOpen(!isUserWindowOpen)
    }
    return (
        <div className='fixed inset-x-0 top-0 bg-slate-100 h-16 pl-6 flex justify-between items-center z-20'>
            <Link href={`/home`}>
                <span className='font-sans text-neutral-600 text-3xl font-bold leading-loose'>Woodsy</span>
            </Link>
            <div className='mr-4'>
                {!id && <Link href={`/login`}>
                    <span className='font-sans text-neutral-600 text-xl font-bold leading-loose'>登入</span>
                </Link>}
                {!id && <Link href={`/register`} className='mx-4'>
                    <span className='font-sans text-neutral-600 text-xl font-bold leading-loose'>免費註冊</span>
                </Link>}
                {!!id && <button className='font-sans text-neutral-600 text-xl font-bold leading-loose' onClick={handleClickUser}>使用者資料</button>}
            </div>
            {isUserWindowOpen && <UserWindow handleCloseUser={handleCloseUser} id={id}/>}
        </div>
    )
}