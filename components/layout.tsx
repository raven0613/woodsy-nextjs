import Navbar from './navbar'
import { FC, PropsWithChildren, useContext, useEffect, useState } from 'react';
import ToTopButton from './toTopButton';
import ConfirmWindow from './confirmWindow';
import React, { useRef } from 'react';
import { userContext } from '../components/UserProvider'
import { Iuser } from '../type-config';
import { useSession } from 'next-auth/react';
import { useRecoilState } from 'recoil'
import { currentUserState } from '../store/user'

export default function Layout({ children }: PropsWithChildren) {
  const { data: session, status } = useSession({
      required: true,
      onUnauthenticated() {
    },
  })
  const [currentUser, setCurrentUser] = useRecoilState(currentUserState)
  useEffect(() => {
    if (status === 'authenticated') {
      setCurrentUser(session.user)
    }
  }, [status, session?.user])
  
  return (
    <>
      <Navbar id={currentUser?.id || 0}/>
      <ToTopButton />
      <main>{children}</main>
    </>
  )
}