import { useRouter } from 'next/router'
import Link from 'next/link'
import { Iarticle, Iuser, successResult } from '../../type-config'
import { signOut } from "next-auth/react"
import React, { useEffect, useState } from 'react'
import inputStyle from '../../styles/LoginPanel.module.css';
import { emailCheck, passWordCheck } from '../../helpers/helpers'
import BirthdayPicker from './birthdayPicker'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)
dayjs().format()

type props = {
    currentUserDetail?: Iuser
    handleEditUser: (user: Iuser) => void
}

export default function UserPanel ({ currentUserDetail, handleEditUser }: props) {
    const [editingStatus, setEditingStatus] = useState<string>('')
    const [name, setName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [passwordForCheck, setPasswordForCheck] = useState<string>('')
    const [nameWarning, setNameWarning] = useState<string>('')
    const [emailWarning, setEmailWarning] = useState<string>('')
    const [passwordWarning, setPasswordWarning] = useState<string>('')
    const [checkPasswordWarning, setCheckPasswordWarning] = useState<string>('')

    const [year, setYear] = useState<number>(0)
    const [month, setMonth] = useState<number>(0)
    const [day, setDay] = useState<number>(0)

    const { name: currName, email: currEmail, birthday: currBirthday } = currentUserDetail as Iuser || ''

    useEffect(() => {
        setName(currName)
        setEmail(currEmail)

        if (!currBirthday) {
            setYear(0)
            setMonth(0)
            setDay(0)
            return
        }
        const localDate = dayjs.utc(currBirthday).local()
        setYear(localDate.year())
        setMonth(localDate.month() + 1)
        setDay(localDate.date())
    }, [currName, currEmail, currBirthday])

    function onClickEdit (e: React.MouseEvent) {
        if (!currentUserDetail) return
        e.preventDefault()
        e.stopPropagation()
        setEditingStatus('info')
        setName(currentUserDetail.name)
        setEmail(currentUserDetail.email)
    }
    function onClickEditPassword (e: React.MouseEvent) {
        if (!currentUserDetail) return
        e.preventDefault()
        e.stopPropagation()
        setEditingStatus('pw')
        setName(currentUserDetail.name)
        setEmail(currentUserDetail.email)
    }
    function onClickSubmit (e: React.MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        if (!currentUserDetail) return
        if (editingStatus === 'info') {
            let dateObj
            emailCheck(email, setEmailWarning, setCantSubmit)
            if (!name) {
                setNameWarning('???????????????')
                canSubmit = false
            }
            if (!canSubmit) return

            // ????????????????????????????????????????????? undefined
            if (year && month && day) {
                dateObj = new Date(year, month - 1, day)
            }
            // ????????????????????????0??? set ??? currentUser ?????????
            if (!year || !month || !day) {
                resetBirthToCurrUser()
            }
            handleEditUser({ ...currentUserDetail, id: currentUserDetail.id, name, email, birthday: dateObj })
        }
        else if (editingStatus === 'pw') {
            passWordCheck(password, setPasswordWarning, setCantSubmit)
            if (!passwordForCheck) {
                setCheckPasswordWarning('?????????????????????')
                canSubmit = false
            }
            if (password !== passwordForCheck) return setCheckPasswordWarning('???????????????????????????')
            if (!canSubmit) return
            handleEditUser({ ...currentUserDetail, id: currentUserDetail.id, password })
        }
        setEditingStatus('')
    }
    function onClickCancel (e: React.MouseEvent) {
        e.preventDefault()
        e.stopPropagation()

        setEditingStatus('')
        setNameWarning('')
        setEmailWarning('')
        setPasswordWarning('')
        setCheckPasswordWarning('')

        if (!currBirthday) return
        resetBirthToCurrUser()
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
    function handleSetBirth (type: string, value: number) {
        switch (type) {
            case 'y': {
                setYear(value)
                break
            }
            case 'm': {
                setMonth(value)
                break
            }
            case 'd': {
                setDay(value)
                break
            }
        }
    }
    function resetBirthToCurrUser () {
        const localDate = dayjs.utc(currBirthday).local()
        setYear(localDate.year())
        setMonth(localDate.month() + 1)
        setDay(localDate.date())
    }
    function handleLogout () {
        signOut({ callbackUrl: `${process.env.NEXT_PUBLIC_BASEURL}/login` })
    }
    return (
        <>
            <main className='border w-full h-80 mt-20 px-10 py-5 rounded-xl flex flex-col justify-between'>
                <div className='w-full'>

                    {editingStatus !== 'pw' && <div className='py-1.5'>
                        <span className='text-sm'>??????</span>
                        {!editingStatus && <span className='border border-transparent hover:border-gray-200 ease-out duration-300 py-2 px-3 rounded-md inline-block w-80'>{name}</span>}
                        {editingStatus && <input type="text" onChange={onNameChange} value={name} className='outline-0 border py-2 px-3 rounded-md w-80' />}
                        {nameWarning && <p className={inputStyle.form_input_warningMsg}>{nameWarning}</p>}
                    </div>}

                    {editingStatus !== 'pw' && <div className='py-1.5'>
                        <span className='text-sm'>email</span>
                        
                        {!editingStatus && <span className='border border-transparent hover:border-gray-200 ease-out duration-300 py-2 px-3 rounded-md inline-block w-80'>{email}</span>}
                        {editingStatus && <input type="text" onChange={onEmailChange} value={email} className='outline-0 border py-2 px-3 rounded-md w-80' />}
                        {emailWarning && <p className={inputStyle.form_input_warningMsg}>{emailWarning}</p>}
                    </div>}

                    {editingStatus !== 'pw' && <div className='py-1.5'>
                        <p className='text-sm'>??????</p>
                        {!currBirthday && editingStatus !== 'info' && <span className='text-gray-400'>????????????</span>}

                        {currBirthday && editingStatus !== 'info' && 
                            <div className='py-2'>
                                <span className='text-gray-700 px-3 border border-transparent'>{year} ???</span>
                                <span className='text-gray-700 px-6 border border-transparent'>{month} ???</span>
                                <span className='text-gray-700 px-6 border border-transparent'>{day} ???</span>
                            </div>
                        }
                        {editingStatus === 'info' && <BirthdayPicker handleSetBirth={handleSetBirth} year={year} month={month} day={day} />}
                    </div>}
                    
                    
                    

                    {editingStatus === 'pw' && <div className='py-1.5'>
                        <input className={passwordWarning? inputStyle.form_input_warning : inputStyle.form_input} 
                        value={password} 
                        onChange={onPasswordChange} 
                        placeholder='???????????????' type="password" />
                        {!passwordWarning && <p className='px-2 py-0.5 h-8 text-gray-400'>??????8?????????????????? + ????????????</p>}
                        {passwordWarning && <p className={inputStyle.form_input_warningMsg}>{passwordWarning}</p>}
                    </div>}

                    {editingStatus === 'pw' && <div className='py-1.5'>
                        <input className={checkPasswordWarning? inputStyle.form_input_warning : inputStyle.form_input} 
                        value={passwordForCheck} 
                        onChange={onPasswordForCheckChange} 
                        placeholder='?????????????????????' type="password" />
                        {!checkPasswordWarning && <p className='px-2 py-0.5 h-8 text-gray-400'></p>}
                        {checkPasswordWarning && <p className={inputStyle.form_input_warningMsg}>{checkPasswordWarning}</p>}
                    </div>}
                </div>

                <div className='pt-3 flex justify-end'>
                    {editingStatus !== 'pw' && <button className='border py-2 px-3 rounded-full mr-3' onClick={onClickEditPassword}>????????????</button>}
                    {editingStatus !== 'info' && <button className='border py-2 px-3 rounded-full' onClick={onClickEdit}>??????????????????</button>}
                    {editingStatus && <button className='border py-2 px-3 rounded-full ml-3' onClick={onClickSubmit}>??????</button>}
                    {editingStatus && <button className='border py-2 px-3 rounded-full ml-3' onClick={onClickCancel}>??????</button>}
                </div>
            </main>
        </>
    )
}

let canSubmit = true

function setCantSubmit () {
    canSubmit = false
}