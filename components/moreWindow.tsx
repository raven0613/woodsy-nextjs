import { useRouter } from 'next/router'
import Link from 'next/link'
import { Iarticle } from '../type-config'
import { useSession, signOut } from "next-auth/react"
import React from 'react'

type props = {
    id: number
    handleClickEdit: () => void
    handleClickDelete: () => void
    handleCloseMore: () => void
}

export default function MoreWindow ({ id, handleCloseMore, handleClickDelete, handleClickEdit }: props) {

    function onClickEdit (e: React.MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        handleClickEdit()
        console.log('編輯')
    }
    function onClickDelete (e: React.MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        handleClickDelete()
    }

    function onClickReport (e: React.MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        console.log('回報')
    }
    function onClickClose (e: React.MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        handleCloseMore()
    }
    return (
        <>
            <div className='w-20 border absolute top-0 right-0 rounded-2xl flex flex-col z-10 bg-white'>
                <button className='py-1 rounded-t-2xl hover:bg-stone-100 ease-out duration-200' onClick={onClickEdit}>編輯</button>
                <button className='py-1 hover:bg-stone-100 ease-out duration-200' onClick={onClickDelete}>刪除</button>
                <button className='py-1 rounded-b-2xl hover:bg-stone-100 ease-out duration-200' onClick={onClickReport}>回報</button>
            </div>
            <div className='fixed inset-0 z-0' onMouseDown={onClickClose}></div>
        </>
    )
}