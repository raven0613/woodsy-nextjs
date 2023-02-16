import { useRouter } from 'next/router'
import Link from 'next/link'
import { Iarticle } from '../../type-config'
import { useSession, signOut } from "next-auth/react"
import React from 'react'

type props = {
    id: number
    handleCloseUser: () => void
}

export default function UserWindow ({ id, handleCloseUser }: props) {
    const router = useRouter()
    function onClickClose (e: React.MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        handleCloseUser()
    }
    function onClickUser (e: React.MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        router.push('/users')
        handleCloseUser()
    }
    function handleLogout () {
        signOut({ callbackUrl: `${process.env.NEXT_PUBLIC_BASEURL}/login` })
    }
    return (
        <>
            <div className='w-28 border absolute top-20 right-5 rounded-2xl flex flex-col z-10 bg-white'>
                <button className='py-2.5 rounded-t-2xl hover:bg-stone-100 ease-out duration-200' onClick={onClickUser}>個人資料</button>
                <button className='py-2.5 rounded-b-2xl hover:bg-stone-100 ease-out duration-200' onClick={handleLogout}>登出</button>
            </div>
            <div className='fixed inset-0 z-0' onMouseDown={onClickClose}></div>
        </>
    )
}