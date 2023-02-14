import { useRouter } from 'next/router'
import { useState } from 'react'
import { FC, PropsWithChildren } from 'react';
import { Ihollow, Iarticle, Iuser, ILoginuser } from '../type-config'
import inputStyle from '../styles/LoginPanel.module.css';
import { emailCheck, passWordCheck } from '../helpers/helpers'

interface IuserProps {
  handleAddUser: (user: Iuser) => void
  type: number   //0: 註冊, 1: 登入
} 

export default function RegisterPanel ({ handleAddUser, type }: IuserProps) {
    const router = useRouter()
    const [name, setName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [passwordForCheck, setPasswordForCheck] = useState<string>('')
    const [isFetching, setIsFetching] = useState<boolean>(false)

    const [nameWarning, setNameWarning] = useState<string>('')
    const [emailWarning, setEmailWarning] = useState<string>('')
    const [passwordWarning, setPasswordWarning] = useState<string>('')
    const [checkPasswordWarning, setCheckPasswordWarning] = useState<string>('')
    
    function handleSetName (e: React.FormEvent<HTMLInputElement>) {
        const value = e.currentTarget.value
        setName(value)
        setNameWarning('')
        canSubmit = true
    }
    function handleSetEmail (e: React.FormEvent<HTMLInputElement>) {
        const value = e.currentTarget.value
        setEmail(value)
        setEmailWarning('')
        canSubmit = true
    }
    function handleSetPassword (e: React.FormEvent<HTMLInputElement>) {
        const value = e.currentTarget.value
        setPassword(value)
        setPasswordWarning('')
        canSubmit = true
    }
    function handleSetPasswordForCheck (e: React.FormEvent<HTMLInputElement>) {
        const value = e.currentTarget.value
        setPasswordForCheck(value)
        setCheckPasswordWarning('')
        canSubmit = true
    }

    function handleSubmitRegister (e: React.MouseEvent) {
        e.preventDefault()
        e.stopPropagation()

        emailCheck(email, setEmailWarning, setCantSubmit)
        passWordCheck(password, setPasswordWarning, setCantSubmit)
        
        if (!name) {
            setNameWarning('請輸入名稱')
            canSubmit = false
        }
        if (!email) {
            setEmailWarning('請輸入 e-mail')
            canSubmit = false
        }
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
        

        setIsFetching(true)
        handleAddUser && handleAddUser({
            name, email, password, role: 'user', account: ''
        })
        setName('')
        setEmail('')
        setPassword('')
        setPasswordForCheck('')
    }
    function handleChangeToLogin (e: React.MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        router.push('/login')
    }

    return (
        <>
            <div className='fixed right-2/4 bottom-2/4 translate-x-1/2 translate-y-1/2 w-8/12 border max-w-2xl rounded-xl shadow-md'>


                <form action="" className='flex flex-col w-8/12 m-auto'>
                    <h1 className='font-sans text-neutral-600 text-3xl font-bold leading-loose py-4'>立即加入 Woodsy</h1>

                    <input className={nameWarning? inputStyle.form_input_warning : inputStyle.form_input} 
                    value={name} 
                    onChange={handleSetName} 
                    placeholder='請輸入名稱' type="text" />
                    {!nameWarning && <p className='px-2 py-1 text-gray-400'></p>}
                    {nameWarning && <p className={inputStyle.form_input_warningMsg}>{nameWarning}</p>}

                    <input className={emailWarning? inputStyle.form_input_warning : inputStyle.form_input} 
                    onChange={handleSetEmail} 
                    value={email} placeholder='請輸入 e-mail' type="text" />
                    {!emailWarning && <p className='px-2 py-1 text-gray-400'>請填寫格式為 user@example.com</p>}
                    {emailWarning && <p className={inputStyle.form_input_warningMsg}>{emailWarning}</p>}

                    <input className={passwordWarning? inputStyle.form_input_warning : inputStyle.form_input} 
                    value={password} 
                    onChange={handleSetPassword} 
                    placeholder='請輸入密碼' type="password" />
                    {!passwordWarning && <p className='px-2 py-1 text-gray-400'>需為8位以上的英文 + 數字組合</p>}
                    {passwordWarning && <p className={inputStyle.form_input_warningMsg}>{passwordWarning}</p>}

                    <input className={checkPasswordWarning? inputStyle.form_input_warning : inputStyle.form_input} 
                    value={passwordForCheck} 
                    onChange={handleSetPasswordForCheck} 
                    placeholder='請再次輸入密碼' type="password" />
                    {!checkPasswordWarning && <p className='px-2 py-1 text-gray-400'></p>}
                    {checkPasswordWarning && <p className={inputStyle.form_input_warningMsg}>{checkPasswordWarning}</p>}
                    
                    {isFetching && <button className='m-auto w-40 h-10 border rounded-lg' disabled onClick={handleSubmitRegister}>送出</button>}
                    {!isFetching && <button className='m-auto w-40 h-10 border rounded-lg' onClick={handleSubmitRegister}>送出</button>}

                    <div className='flex justify-end pt-20 pb-4'>
                        <span className='pr-4'>已經有帳戶了嗎？ </span>
                        <button className='' type='button' onClick={handleChangeToLogin}>登入</button>
                    </div>
                </form>
                
            </div>
        </>
    )
}

let canSubmit = true

function setCantSubmit () {
    canSubmit = false
}