import { useRouter } from 'next/router'
import { useContext, useState } from 'react'
import useSWRMutation from 'swr/mutation'
import { Ihollow, Iarticle, Iuser, ILoginuser, userLoginArg } from '../type-config'
import { userLogin } from '../api_helpers/apis/user'
import LoginPanel from '../components/loginPanel';
import { getCsrfToken } from "next-auth/react"
import { useSession, signIn } from "next-auth/react"
import { userContext } from '../components/UserProvider'

export default function Login () {
    const { currentUser, handleSetCurrentUser } = useContext(userContext)
    
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
        email: user.email,
        password: user.password,
    })
}