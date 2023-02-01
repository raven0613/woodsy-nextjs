import Navbar from './navbar'
import { FC, PropsWithChildren } from 'react';
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