import { useRouter } from 'next/router'
import { useState } from 'react'
import { FC, PropsWithChildren } from 'react';
import { flushSync } from 'react-dom';
import { Ihollow, Iarticle, Iuser, ILoginuser } from '../type-config'

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

    function handleSetValue (e: React.FormEvent<HTMLInputElement>, setter: (value: string) => void) {
        const value = e.currentTarget.value
        setter(value)
    }
    function handleSubmitRegister (e: React.MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        handleAddUser && handleAddUser({
            name, account, email, password, articles: 0, subHollows: 0, role: 'user'
        })
        setName('')
        setEmail('')
        setAccount('')
        setPassword('')
    }
    function handleClickLogin (e: React.MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        router.push('/login')
    }

    return (
        <>
            <div className='fixed right-2/4 bottom-2/4 translate-x-1/2 translate-y-1/2 w-8/12 h-96 border'>
                <h1 className=''>立即加入 Woodsy</h1>
                <form action="" className='flex flex-col'>
                    <input className='border' 
                    value={name} 
                    onChange={e => {handleSetValue(e, setName)}} 
                    placeholder='請輸入名稱' type="text" />

                    <input className='border' 
                    onChange={e => {handleSetValue(e, setEmail)}} 
                    value={email} placeholder='請輸入E-mail' type="text" />

                    <input className='border' 
                    value={account} 
                    onChange={e => {handleSetValue(e, setAccount)}} 
                    placeholder='請輸入帳號' type="text" />

                    <input className='border' 
                    value={password} 
                    onChange={e => {handleSetValue(e, setPassword)}} 
                    placeholder='請輸入密碼' type="password" />

                    <button className='w-20 h-8 border' onClick={handleSubmitRegister}>送出</button>

                    <span>已經有帳戶了嗎？ </span>
                    <button onClick={handleClickLogin}>登入</button>

                </form>
                
            </div>
        </>
    )
}