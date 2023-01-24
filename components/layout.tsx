import Navbar from './navbar'
import { FC, PropsWithChildren } from 'react';


export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  )
}