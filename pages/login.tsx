
import { useRouter } from 'next/router'
import { useState } from 'react'
import useSWRMutation from 'swr/mutation'
import { Ihollow, Iarticle, Iuser, ILoginuser, userLoginArg } from '../type-config'
import { userLogin } from '../api_helpers/apis/user'
import LoginPanel from '../components/loginPanel';


export default function Login () {
    // user 登入
    const { trigger: loginUserTrigger, isMutating: loginUserIsMutating, data: loginUserData, error: loginUserError } = useSWRMutation<Iuser, Error>(`auth/signIn`, fetchLoginUser);

    function handleLogin (user: ILoginuser) {
        loginUserTrigger(user)
    }
    return (
        <>
            <LoginPanel handleLogin={handleLogin} type={1}/>
        </>
    )
}

async function fetchLoginUser (url: string, { arg }: userLoginArg) {
    try {
        const { data } = await userLogin(url, arg)
        return data
    } catch (err) {
        console.log(err)
    }
}