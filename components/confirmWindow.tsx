import { useRouter } from 'next/router'
import Link from 'next/link'
import { Iarticle } from '../type-config'
import { useSession, signOut } from "next-auth/react"
import React from 'react'

type props = {
    id: number
    // handleEdit: (article: Iarticle) => void
    // handleDelete: (articleId: number) => void
    // handleCloseMore: () => void
    handleDeleteArt: (articleId: number) => void
    handleConfirmWindow: () => void
}

export default function ConfirmWindow ({ id, handleDeleteArt, handleConfirmWindow }: props) {
    
    function onClickOk (e: React.MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        handleDeleteArt(id)
    }
    function onClickCancel (e: React.MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        handleConfirmWindow()
    }
    return (
        <>
            <div className='w-80 h-40 fixed right-2/4 bottom-2/4 translate-x-1/2 translate-y-1/2 border shadow-lg shadow-stone-300 rounded-xl flex flex-col z-10 bg-white justify-between items-center'>
                <div className='w-full pt-10'>
                    <p className='w-full text-center pb-1'>刪除的話題將無法復原</p>
                    <p className='w-full text-center'>確定要刪除嗎？</p>
                </div>
                <div className='flex items-center pb-4'>
                    <button className='leading-8 border w-20 h-8 rounded-full mx-2' onClick={onClickCancel}>取消</button>
                    <button className='leading-8 bg-slate-200 border w-20 h-8 rounded-full mx-2' onClick={onClickOk}>確定</button>
                </div>
            </div>
            <div className='fixed inset-0 z-0' onMouseDown={onClickCancel}></div>
        </>
    )
}