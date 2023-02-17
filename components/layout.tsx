import Navbar from './navbar'
import { FC, PropsWithChildren, useContext, useEffect, useState } from 'react';
import ToTopButton from './toTopButton';
import ConfirmWindow from './confirmWindow';
import React, { useRef } from 'react';
import { userContext } from '../components/UserProvider'

export default function Layout({ children }: PropsWithChildren) {
  const { currentUser } = useContext(userContext)
  return (
    <>
      <Navbar id={currentUser?.id || 0}/>
      <ToTopButton />
      <main>{children}</main>
    </>
  )
}