import { useRouter } from 'next/router'
import Link from 'next/link'
import { Iarticle } from '../type-config'
import { useSession, signOut } from "next-auth/react"
import React from 'react'

type props = {
    id: number
}

export default function MoreWindow ({ id }: props) {
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
        },
    })
    function handleClickDelete (e: React.MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
    }
    function handleClickReport (e: React.MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
    }
    return (
        <div className='w-20 h-28 border absolute top-0 right-0 rounded-4'>
            <button onClick={handleClickDelete}>刪除</button>
            <button onClick={handleClickReport}>回報</button>
        </div>
    )
}