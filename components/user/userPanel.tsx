import { useRouter } from 'next/router'
import Link from 'next/link'
import { Iarticle, Iuser, successResult } from '../../type-config'
import { signOut } from "next-auth/react"
import React, { useEffect, useState } from 'react'
import inputStyle from '../../styles/LoginPanel.module.css';
import { emailCheck, passWordCheck } from '../../helpers/helpers'

type SetState = React.SetStateAction<any>

type props = {
    currentUser?: Iuser
    handleEditUser: (user: Iuser) => void
    userEditData?: successResult
}

export default function UserPanel ({ currentUser, handleEditUser, userEditData }: props) {
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [name, setName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [birthday, setBirthday] = useState<string>('')
    const [nameWarning, setNameWarning] = useState<string>('')
    const [emailWarning, setEmailWarning] = useState<string>('')
    const { name: editedName, email: editedEmail } = userEditData?.payload as Iuser || ''
    const { name: currName, email: currEmail } = currentUser as Iuser || ''

    useEffect(() => {
        if (!currName || !currEmail) return
        setName(currName)
        setEmail(currEmail)
    }, [currName, currEmail])

    useEffect(() => {
        if (!editedName || !editedEmail) return
        setName(editedName)
        setEmail(editedEmail)
    }, [editedName, editedEmail])

    function onClickEdit (e: React.MouseEvent) {
        if (!currentUser) return
        e.preventDefault()
        e.stopPropagation()
        setIsEditing(!isEditing)
        setName(currentUser.name)
        setEmail(currentUser.email)
    }
    function onClickSubmit (e: React.MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        if (!currentUser) return

        emailCheck(email, setEmailWarning, setCantSubmit)
        if (!name) {
            setNameWarning('請輸入名稱')
            canSubmit = false
        }
        if (!email) {
            setEmailWarning('請輸入 e-mail')
            canSubmit = false
        }
        if (!canSubmit) return
        setIsEditing(!isEditing)
        handleEditUser({ ...currentUser, id: currentUser.id, name, email })
    }
    function onClickCancel (e: React.MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        setIsEditing(!isEditing)
        setNameWarning('')
        setEmailWarning('')
    }
    function onNameChange (e: React.FormEvent<HTMLInputElement>) {
        const value = e.currentTarget.value
        setName(value)
    }
    function onEmailChange (e: React.FormEvent<HTMLInputElement>) {
        const value = e.currentTarget.value
        setEmail(value)
    }
    function handleLogout () {
        signOut({ callbackUrl: `${process.env.NEXT_PUBLIC_BASEURL}/login` })
    }
    return (
        <>
            <main className='border w-full mt-20 px-10 py-5 rounded-xl'>
                <div className='py-1.5'>
                    <p className='text-sm'>名稱</p>
                    {!isEditing && <p className='border py-2 px-3 rounded-md'>{name}</p>}
                    {isEditing && <input type="text" onChange={onNameChange} value={name} className='outline-0 border py-2 px-3 rounded-md' />}
                    {nameWarning && <p className={inputStyle.form_input_warningMsg}>{nameWarning}</p>}
                </div>
                <div className='py-1.5'>
                    <p className='text-sm'>email</p>
                    {!isEditing && <p className='border py-2 px-3 rounded-md'>{email}</p>}
                    {isEditing && <input type="text" onChange={onEmailChange} value={email} className='outline-0 border py-2 px-3 rounded-md' />}
                    {emailWarning && <p className={inputStyle.form_input_warningMsg}>{emailWarning}</p>}
                </div>
                <div className='py-1.5'>
                    <p className='text-sm'>生日</p>
                    <p className='border py-2 px-3 rounded-md'>{`6/13`}</p>
                </div>
                <div className='pt-3 flex justify-end'>
                    <button className='border py-2 px-3 rounded-full mr-3' onClick={onClickEdit}>修改密碼</button>
                    {!isEditing && <button className='border py-2 px-3 rounded-full' onClick={onClickEdit}>編輯個人資料</button>}
                    {isEditing && <button className='border py-2 px-3 rounded-full mr-3' onClick={onClickSubmit}>送出</button>}
                    {isEditing && <button className='border py-2 px-3 rounded-full' onClick={onClickCancel}>取消</button>}
                </div>
            </main>
        </>
    )
}

let canSubmit = true

function setCantSubmit () {
    canSubmit = false
}