import { useRouter } from 'next/router'
import { useState } from 'react'
import { FC, PropsWithChildren } from 'react';
import { flushSync } from 'react-dom';
import { Ihollow, Iarticle, Iuser, ILoginuser } from '../type-config'
import inputStyle from '../styles/LoginPanel.module.css';


interface IuserProps {
  handleAddUser: (user: Iuser) => void
  type: number   //0: 註冊, 1: 登入
} 

export default function RegisterPanel ({ handleAddUser, type }: IuserProps) {
    const router = useRouter()
    const [name, setName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [account, setAccount] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [passwordForCheck, setPasswordForCheck] = useState<string>('')
    const [isFetching, setIsFetching] = useState<boolean>(false)

    function handleSetValue (e: React.FormEvent<HTMLInputElement>, setter: (value: string) => void) {
        const value = e.currentTarget.value
        setter(value)
    }
    function handleSubmitRegister (e: React.MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        if (!name || !account || !password) return console.log('請輸入註冊資訊')
        if (password !== passwordForCheck) return console.log('確認密碼與密碼不符')
        setIsFetching(true)
        handleAddUser && handleAddUser({
            name, account, email, password, role: 'user'
        })
        setName('')
        setEmail('')
        setAccount('')
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

                    <input className={inputStyle.form_input} 
                    value={name} 
                    onChange={e => {handleSetValue(e, setName)}} 
                    placeholder='請輸入名稱' type="text" />

                    <input className={inputStyle.form_input} 
                    onChange={e => {handleSetValue(e, setEmail)}} 
                    value={email} placeholder='請輸入E-mail' type="text" />

                    <input className={inputStyle.form_input} 
                    value={account} 
                    onChange={e => {handleSetValue(e, setAccount)}} 
                    placeholder='請輸入帳號' type="text" />

                    <input className={inputStyle.form_input} 
                    value={password} 
                    onChange={e => {handleSetValue(e, setPassword)}} 
                    placeholder='請輸入密碼' type="password" />

                    <input className={inputStyle.form_input} 
                    value={passwordForCheck} 
                    onChange={e => {handleSetValue(e, setPasswordForCheck)}} 
                    placeholder='請再次輸入密碼' type="password" />

                    
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