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
    const [editingStatus, setEditingStatus] = useState<string>('')

    const [name, setName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [passwordForCheck, setPasswordForCheck] = useState<string>('')
    const [birthday, setBirthday] = useState<string>('')
    const [nameWarning, setNameWarning] = useState<string>('')
    const [emailWarning, setEmailWarning] = useState<string>('')
    const [passwordWarning, setPasswordWarning] = useState<string>('')
    const [checkPasswordWarning, setCheckPasswordWarning] = useState<string>('')

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
        setEditingStatus('info')
        setName(currentUser.name)
        setEmail(currentUser.email)
    }
    function onClickEditPassword (e: React.MouseEvent) {
        if (!currentUser) return
        e.preventDefault()
        e.stopPropagation()
        setEditingStatus('pw')
        setName(currentUser.name)
        setEmail(currentUser.email)
    }
    function onClickSubmit (e: React.MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        if (!currentUser) return
        if (editingStatus === 'info') {
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
            handleEditUser({ ...currentUser, id: currentUser.id, name, email })
        }
        else if (editingStatus === 'pw') {
            passWordCheck(password, setPasswordWarning, setCantSubmit)
            if (!password) {
                setPasswordWarning('請輸入密碼')
                canSubmit = false
            }
            if (!passwordForCheck) {
                setCheckPasswordWarning('請再次輸入密碼')
                canSubmit = false
            }
            if (password !== passwordForCheck) return setCheckPasswordWarning('確認密碼與密碼不符')
            if (!canSubmit) return
            handleEditUser({ ...currentUser, id: currentUser.id, password })
        }
        setEditingStatus('')
    }
    function onClickCancel (e: React.MouseEvent) {
        e.preventDefault()
        e.stopPropagation()

        setEditingStatus('')
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
    function onPasswordChange (e: React.FormEvent<HTMLInputElement>) {
        const value = e.currentTarget.value
        setPassword(value)
        setPasswordWarning('')
        canSubmit = true
    }
    function onPasswordForCheckChange (e: React.FormEvent<HTMLInputElement>) {
        const value = e.currentTarget.value
        setPasswordForCheck(value)
        setCheckPasswordWarning('')
        canSubmit = true
    }
    function handleLogout () {
        signOut({ callbackUrl: `${process.env.NEXT_PUBLIC_BASEURL}/login` })
    }
    return (
        <>
            <main className='border w-full h-80 mt-20 px-10 py-5 rounded-xl flex flex-col justify-between'>
                <div className='w-full'>
                    {editingStatus !== 'pw' && <div className='py-1.5'>
                        <p className='text-sm'>名稱</p>
                        {!editingStatus && <p className='border py-2 px-3 rounded-md'>{name}</p>}
                        {editingStatus && <input type="text" onChange={onNameChange} value={name} className='outline-0 border py-2 px-3 rounded-md' />}
                        {nameWarning && <p className={inputStyle.form_input_warningMsg}>{nameWarning}</p>}
                    </div>}
                    {editingStatus !== 'pw' && <div className='py-1.5'>
                        <p className='text-sm'>email</p>
                        {!editingStatus && <p className='border py-2 px-3 rounded-md'>{email}</p>}
                        {editingStatus && <input type="text" onChange={onEmailChange} value={email} className='outline-0 border py-2 px-3 rounded-md' />}
                        {emailWarning && <p className={inputStyle.form_input_warningMsg}>{emailWarning}</p>}
                    </div>}
                    {editingStatus !== 'pw' && <div className='py-1.5'>
                        <p className='text-sm'>生日</p>
                        <p className='border py-2 px-3 rounded-md'>{`6/13`}</p>
                    </div>}

                    {editingStatus === 'pw' && <div className='py-1.5'>
                        <input className={passwordWarning? inputStyle.form_input_warning : inputStyle.form_input} 
                        value={password} 
                        onChange={onPasswordChange} 
                        placeholder='請輸入密碼' type="password" />
                        {!passwordWarning && <p className='px-2 py-0.5 h-8 text-gray-400'>需為8位以上的英文 + 數字組合</p>}
                        {passwordWarning && <p className={inputStyle.form_input_warningMsg}>{passwordWarning}</p>}
                    </div>}

                    {editingStatus === 'pw' && <div className='py-1.5'>
                        <input className={checkPasswordWarning? inputStyle.form_input_warning : inputStyle.form_input} 
                        value={passwordForCheck} 
                        onChange={onPasswordForCheckChange} 
                        placeholder='請再次輸入密碼' type="password" />
                        {!checkPasswordWarning && <p className='px-2 py-0.5 h-8 text-gray-400'></p>}
                        {checkPasswordWarning && <p className={inputStyle.form_input_warningMsg}>{checkPasswordWarning}</p>}
                    </div>}
                </div>

                <div className='pt-3 flex justify-end'>
                    {editingStatus !== 'pw' && <button className='border py-2 px-3 rounded-full mr-3' onClick={onClickEditPassword}>修改密碼</button>}
                    {editingStatus !== 'info' && <button className='border py-2 px-3 rounded-full' onClick={onClickEdit}>編輯個人資料</button>}
                    {editingStatus && <button className='border py-2 px-3 rounded-full ml-3' onClick={onClickSubmit}>送出</button>}
                    {editingStatus && <button className='border py-2 px-3 rounded-full ml-3' onClick={onClickCancel}>取消</button>}
                </div>
            </main>
        </>
    )
}

let canSubmit = true

function setCantSubmit () {
    canSubmit = false
}