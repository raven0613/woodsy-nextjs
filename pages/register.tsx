import { useRouter } from 'next/router'
import { useState } from 'react'
import useSWRMutation from 'swr/mutation'
import { Ihollow, Iarticle, Iuser, userArg } from '../type-config'
import { userRegister } from '../api_helpers/apis/user'
import LoginPanel from '../components/loginPanel';
import RegisterPanel from '../components/registerPanel';

export default function Register () {
    // 新增一筆 user
    const { trigger: addUserTrigger, isMutating: addUserIsMutating, data: addedUserData, error: addedUserError } = useSWRMutation<Iuser, Error>(`register`, fetchAddUser);

    function handleAddUser (user: Iuser) {
        addUserTrigger(user)
    }
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