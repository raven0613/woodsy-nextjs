import { useRouter } from 'next/router'
import { useState } from 'react'
import { FC, PropsWithChildren } from 'react';
import { ILoginuser } from '../type-config'
import inputStyle from '../styles/LoginPanel.module.css';
import { emailCheck, passWordCheck } from '../helpers/helpers'

interface IuserProps {
  handleLogin: (user: ILoginuser) => void
} 

export default function LoginPanel ({ handleLogin }: IuserProps) {
    const router = useRouter()
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [isFetching, setIsFetching] = useState<boolean>(false)
    
    const [emailWarning, setEmailWarning] = useState<string>('')
    const [passwordWarning, setPasswordWarning] = useState<string>('')

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

    function handleSubmitLogin (e: React.MouseEvent) {
        e.preventDefault()
        e.stopPropagation()

        emailCheck(email, setEmailWarning, setCantSubmit)
        passWordCheck(password, setPasswordWarning, setCantSubmit)

        if (!email) {
            setEmailWarning('請輸入 e-mail')
            canSubmit = false
        }
        if (!password) {
            setPasswordWarning('請輸入密碼')
            canSubmit = false
        }
        if (!canSubmit) return

        setIsFetching(true)
        handleLogin({
            email, password
        })
        setEmail('')
        setPassword('')
        setEmailWarning('')
        setPasswordWarning('')
    }

    function handleChangeToRegister (e: React.MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        router.push('/register')
    }

    return (
        <>
            <div className='fixed right-2/4 bottom-2/4 translate-x-1/2 translate-y-1/2 w-8/12 border max-w-2xl rounded-xl shadow-md'>


                <form action="" className='flex flex-col w-6/12 m-auto'>
                    <h1 className='font-sans text-neutral-600 text-3xl font-bold leading-loose py-4'>歡迎回到 Woodsy</h1>

                    <input className={emailWarning? inputStyle.form_input_warning : inputStyle.form_input} 
                    onChange={handleSetEmail} 
                    value={email} placeholder='請輸入 e-mail' type="text" />
                    {!emailWarning && <p className='px-2 py-0.5 h-8 text-gray-400'>請填寫格式為 user@example.com</p>}
                    {emailWarning && <p className={inputStyle.form_input_warningMsg}>{emailWarning}</p>}

                    <input className={passwordWarning? inputStyle.form_input_warning : inputStyle.form_input} 
                    value={password} 
                    onChange={handleSetPassword} 
                    placeholder='請輸入密碼' type="password" />
                    {!passwordWarning && <p className='px-2 py-0.5 h-8 text-gray-400'>需為8位以上的英文 + 數字組合</p>}
                    {passwordWarning && <p className={inputStyle.form_input_warningMsg}>{passwordWarning}</p>}

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

let canSubmit = true

function setCantSubmit () {
    canSubmit = false
}

