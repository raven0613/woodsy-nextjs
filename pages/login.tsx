
import { useRouter } from 'next/router'
import { useState } from 'react'
import useSWRMutation from 'swr/mutation'
import { Ihollow, Iarticle, Iuser, ILoginuser, userLoginArg } from '../type-config'
import { userLogin } from '../api_helpers/apis/user'
import LoginPanel from '../components/loginPanel';

import { getCsrfToken } from "next-auth/react"

import { useSession, signIn } from "next-auth/react"

export default function Login () {
    console.log('變數')
    console.log(process.env.NEXTAUTH_URL)
    console.log(process.env.NEXT_PUBLIC_BASEURL)
    console.log(process.env.MYSQL_DATABASE)
    console.log(process.env.MYSQL_HOST)
    const router = useRouter()
    // status: "loading" | "authenticated" | "unauthenticated"
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
        },
    })
    if (session) {
        router.push('/home')
    } 
    
    return (
        <>
            <LoginPanel handleLogin={handleLogin}/>
        </>
    )
}

export async function handleLogin (user: ILoginuser) {
    await signIn('credentials', {
        redirect: false,
        account: user.account,
        password: user.password,
    })
}