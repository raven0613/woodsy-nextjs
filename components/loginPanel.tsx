import { useRouter } from 'next/router'
import { useState } from 'react'
import { FC, PropsWithChildren } from 'react';
import { flushSync } from 'react-dom';
import { ILoginuser } from '../type-config'
import inputStyle from '../styles/LoginPanel.module.css';

interface IuserProps {
  handleLogin: (user: ILoginuser) => void
} 

export default function LoginPanel ({ handleLogin }: IuserProps) {
    const router = useRouter()
    const [account, setAccount] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [isFetching, setIsFetching] = useState<boolean>(false)


    function handleSetValue (e: React.FormEvent<HTMLInputElement>, setter: (value: string) => void) {
        const value = e.currentTarget.value
        setter(value)
    }

    function handleSubmitLogin (e: React.MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        if (!account || !password) return console.log('請輸入帳號密碼')
        setIsFetching(true)
        handleLogin({
            account, password
        })
        setAccount('')
        setPassword('')
    }
    function handleChangeToRegister (e: React.MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        router.push('/register')
    }
    return (
        <>
            <div className='fixed right-2/4 bottom-2/4 translate-x-1/2 translate-y-1/2 w-8/12 border max-w-2xl rounded-xl shadow-md'>


                <form action="" className='flex flex-col w-8/12 m-auto'>
                    <h1 className='font-sans text-neutral-600 text-3xl font-bold leading-loose py-4'>歡迎回到 Woodsy</h1>

                    <input className={inputStyle.form_input} 
                    onChange={e => {handleSetValue(e, setAccount)}} 
                    value={account} placeholder='請輸入帳號' type="text" />

                    <input className={inputStyle.form_input} 
                    value={password} 
                    onChange={e => {handleSetValue(e, setPassword)}} 
                    placeholder='請輸入密碼' type="password" />


                    {isFetching && <button className='m-auto w-40 h-10 border rounded-lg' disabled onClick={handleSubmitLogin}>登入</button>}

                    {!isFetching && <button className='m-auto w-40 h-10 border rounded-lg' onClick={handleSubmitLogin}>登入</button>}

                    <div className='flex justify-end pt-20 pb-4'>
                        <span className='pr-4'>還沒有加入 Woodsy？ </span>
                        <button className='' type='button' onClick={handleChangeToRegister}>立即加入</button>
                    </div>
                </form>
                
            </div>
        </>
    )
}