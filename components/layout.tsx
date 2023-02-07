import Navbar from './navbar'
import { FC, PropsWithChildren, useEffect, useState } from 'react';
import ToTopButton from './toTopButton';
import ConfirmWindow from './confirmWindow';
import React, { useRef } from 'react';


export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <Navbar />
      <ToTopButton />
      <main>{children}</main>
    </>
  )
}