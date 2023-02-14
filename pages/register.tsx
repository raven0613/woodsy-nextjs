import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import useSWRMutation from 'swr/mutation'
import { Ihollow, Iarticle, Iuser, userArg, ILoginuser, successResult } from '../type-config'
import { userRegister } from '../api_helpers/apis/user'
import LoginPanel from '../components/loginPanel';
import RegisterPanel from '../components/registerPanel';
import { useSession, signIn } from "next-auth/react"
import { handleLogin } from './login'

export default function Register () {
    const [isFetching, setIsFetching] = useState<boolean>(false)
    const [password, setPassword] = useState<string>('')

    const router = useRouter()
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
        },
    })
    if (session) {
        router.push('/home')
    } 
    // 新增一筆 user
    const { trigger: addUserTrigger, isMutating: addUserIsMutating, data: addedUserData, error: addedUserError } = useSWRMutation<successResult, Error>(`register`, fetchAddUser);

    function handleAddUser (user: Iuser) {
        if (!user.password) return
        addUserTrigger(user)
        setPassword(user.password)
    }
    
    useEffect(() => {
        if (addedUserError) return
        if (!addedUserData?.success || !addedUserData?.payload) return
        if (isFetching) return
        const IuserData = addedUserData.payload as Iuser;
        const user: ILoginuser = {
            email: IuserData.email,
            password
        }
        handleLogin(user)
        setIsFetching(true)
    }, [addedUserError, addedUserData, isFetching, password])

    return (
        <>
            <RegisterPanel handleAddUser={handleAddUser} type={0}/>
        </>
    )
}

async function fetchAddUser (url: string, { arg }: userArg) {
    try {
        const { data } = await userRegister(url, arg)
        return data
    } catch (err) {
        console.log(err)
    }
}