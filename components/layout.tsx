import Navbar from './navbar'
import { FC, PropsWithChildren, useState } from 'react';
import ToTopButton from './toTopButton';



export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <ToTopButton />
    </>
  )
}