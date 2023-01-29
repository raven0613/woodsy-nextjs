import { useRouter } from 'next/router'
import { useState } from 'react'
import { FC, PropsWithChildren } from 'react';
import { flushSync } from 'react-dom';
import { Ihollow, Iarticle, Iuser, ILoginuser } from '../type-config'


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
            <div className='fixed right-2/4 bottom-2/4 translate-x-1/2 translate-y-1/2 w-8/12 h-96 border'>
                <h1 className=''>歡迎回到 Woodsy</h1>
                <form action="" className='flex flex-col'>

                    <input className='border' 
                    onChange={e => {handleSetValue(e, setAccount)}} 
                    value={account} placeholder='請輸入帳號或E-mail' type="text" />

                    <input className='border' 
                    value={password} 
                    onChange={e => {handleSetValue(e, setPassword)}} 
                    placeholder='請輸入密碼' type="password" />

                    {isFetching && <button className='w-20 h-8 border' disabled onClick={handleSubmitLogin}>登入</button>}

                    {!isFetching && <button className='w-20 h-8 border' onClick={handleSubmitLogin}>登入</button>}
                    <span>還沒有加入 Woodsy？ </span>
                    <button type='button' onClick={handleChangeToRegister}>立即加入</button>
                </form>
                
            </div>
        </>
    )
}