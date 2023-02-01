import { useRouter } from 'next/router'
import Link from 'next/link'
import { Iarticle } from '../type-config'
import { useSession, signOut } from "next-auth/react"
import React from 'react'

type props = {
    id: number
    handleEdit: (article: Iarticle) => void
    handleDelete: (articleId: number) => void
    handleCloseMore: () => void
}

export default function MoreWindow ({ id, handleCloseMore }: props) {
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
        },
    })
    function handleClickEdit (e: React.MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        console.log('編輯')
    }
    function handleClickDelete (e: React.MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        console.log('刪除')
    }

    function handleClickReport (e: React.MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        console.log('回報')
    }
    function handleClickClose (e: React.MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        handleCloseMore()
    }
    return (
        <>
            <div className='w-20 border absolute top-0 right-0 rounded-4 flex flex-col z-10'>
                <button className='py-1.5' onClick={handleClickEdit}>編輯</button>
                <button className='pb-1.5' onClick={handleClickDelete}>刪除</button>
                <button className='pb-1.5' onClick={handleClickReport}>回報</button>
            </div>
            <div className='fixed inset-0 z-0' onClick={handleClickClose}></div>
        </>
    )
}