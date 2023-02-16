import { useRouter } from 'next/router'
import { FC, PropsWithChildren, useEffect, useState } from 'react';
import ToTopButton from './toTopButton';
import ConfirmWindow from './confirmWindow';
import ArticleEditWindow from './article/articleEditWindow';
import React, { useRef } from 'react';
import useSWRMutation from 'swr/mutation'
import { fetchDeleteArticle, fetchEditArticle, fetchDeleteComments } from '../api_helpers/fetchers'
import { Iuser, Ihollow, Iarticle, Icomment, param, serverProps, articleArg, deleteArg, successResult, likePayload, paramArg, rows, IArticleContext, IUIContext, IUserContext } from '../type-config';
import { useSession } from 'next-auth/react';


export const userContext = React.createContext<IUserContext>({})


export default function UserProvider({ children }: PropsWithChildren) {
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
        },
    })
    const [currentUser, setCurrentUser] = useState<Iuser>()

    useEffect(() => {
        if (status === 'authenticated') {
            setCurrentUser(session.user)
        }
    }, [status, session?.user])


    function handleSetCurrentUser (user: Iuser) {
        setCurrentUser(user)
    }

    // context value 區
    const userContextValue: IUserContext = {
        currentUser, handleSetCurrentUser
    }

    return (
        <>
            <userContext.Provider value={userContextValue}>
                <main>{children}</main>
            </userContext.Provider>
        </>
    )
}