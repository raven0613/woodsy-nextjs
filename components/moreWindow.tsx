import { useRouter } from 'next/router'
import Link from 'next/link'
import { Iarticle } from '../type-config'
import React, { useContext } from 'react'
import { userContext } from '../components/UserProvider'

type props = {
    id: number
    userId: number
    handleClickEdit: () => void
    handleClickDelete: () => void
    handleCloseMore: () => void
}
let isBelongsToCurrUser: boolean = false

export default function MoreWindow ({ id, userId, handleCloseMore, handleClickDelete, handleClickEdit }: props) {
    const { currentUser } = useContext(userContext)
    isBelongsToCurrUser = currentUser?.id === userId? true : false

    function onClickEdit (e: React.MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        if (!isBelongsToCurrUser) return
        handleClickEdit()
    }
    function onClickDelete (e: React.MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        if (!isBelongsToCurrUser) return
        handleClickDelete()
    }

    function onClickReport (e: React.MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
    }
    function onClickClose (e: React.MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        handleCloseMore()
    }

    const rounded = isBelongsToCurrUser? 'rounded-b-2xl py-1 hover:bg-stone-100 ease-out duration-200' : 'rounded-2xl py-1 hover:bg-stone-100 ease-out duration-200'
    return (
        <>
            <div className='w-20 border absolute top-0 right-0 rounded-2xl flex flex-col z-10 bg-white'>
                {isBelongsToCurrUser && <button className='py-1 rounded-t-2xl hover:bg-stone-100 ease-out duration-200' onClick={onClickEdit}>編輯</button>}
                {isBelongsToCurrUser && <button className='py-1 hover:bg-stone-100 ease-out duration-200' onClick={onClickDelete}>刪除</button>}
                <button className={rounded} onClick={onClickReport}>回報</button>
            </div>
            <div className='fixed inset-0 z-0' onMouseDown={onClickClose}></div>
        </>
    )
}

