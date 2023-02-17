import { useRouter } from 'next/router'
import Link from 'next/link'
import { Iarticle, Iuser, successResult } from '../../type-config'
import { signOut } from "next-auth/react"
import React, { useEffect, useState } from 'react'
import inputStyle from '../../styles/LoginPanel.module.css';
import { emailCheck, passWordCheck } from '../../helpers/helpers'

type SetState = React.SetStateAction<any>

type props = {
    handleSetBirth: (type: string, value: number) => void
    year: number
    month: number
    day: number
}

export default function BirthdayPicker ({ handleSetBirth, year, month, day }: props) {

    function onSelect (e: React.ChangeEvent<HTMLSelectElement>, type: string) {
        switch(type) {
            case 'y': {
                if (year % 4 === 0 && day > 28) {  // 如果原本選潤年 date 又在 29 以上就打回 1
                    handleSetBirth('d', 0)
                }
                handleSetBirth('y', Number(e.currentTarget.value))
                break
            }
            case 'm': {
                const smaller = [4, 6, 9, 11]
                // 原本選大月，後來改小月，date 又超過 30
                if (!smaller.includes(month) && smaller.includes(Number(e.currentTarget.value)) && day > 30) {
                    handleSetBirth('d', 0)
                }
                // 原本選閏年 2 月以外其他月份，date 又超過 29
                if (year % 4 === 0 && month !== 2 && Number(e.currentTarget.value) === 2 && day > 29) {
                    handleSetBirth('d', 0)
                }
                // 原本選一般年 2 月以外其他月份，date 又超過 28
                if (year % 4 !== 0 && month !== 2 && Number(e.currentTarget.value) === 2 && day > 28) {
                    handleSetBirth('d', 0)
                }
                handleSetBirth('m', Number(e.currentTarget.value))
                break
            }
            case 'd': {
                handleSetBirth('d', Number(e.currentTarget.value))
                break
            }
        }
    }
    return (
        <>
            <select defaultValue={year} onChange={(e) => {onSelect(e, 'y')}} name="" id="" className='outline-0 border w-20 h-10 p-2 rounded-md mr-4'>
                <option value='0'>-</option>
                {options(1920, 2023, 'y', month, year)}
            </select>

            <select defaultValue={month} onChange={(e) => {onSelect(e, 'm')}} name="" id="" className='outline-0 border w-16 h-10 p-2 rounded-md mr-4'>
                <option value='0'>-</option>
                {options(1, 12, 'm', month, year)}
            </select>

            <select defaultValue={day} onChange={(e) => {onSelect(e, 'd')}} name="" id="" className='outline-0 border w-16 h-10 p-2 rounded-md'>
                <option value='0'>-</option>
                {options(1, 31, 'd', month, year)}
            </select>
        </>
    )
}

function options (start: number, end: number, type: string, month: number, year: number) {
    
    let pointer = start
    let ops = []

    const smaller = [4, 6, 9, 11]
    if (type === 'd' && smaller.includes(month)) {  // 小月
        while (pointer <= end - 1) {
            ops.push(<option value={pointer} key={pointer}>{pointer}</option>)
            pointer++
        }
    }
    else if (type === 'd' && month === 2) {  // 2月
        if (year % 4 === 0) {   // 閏年
            while (pointer <= end - 2) {
                ops.push(<option value={pointer} key={pointer}>{pointer}</option>)
                pointer++
            }
        }
        if (year % 4 !== 0) {   // 其他年份
            while (pointer <= end - 3) {
                ops.push(<option value={pointer} key={pointer}>{pointer}</option>)
                pointer++
            }
        }
    }
    else {   // 年 大月 日
        while (pointer <= end) {
            ops.push(<option value={pointer} key={pointer}>{pointer}</option>)
            pointer++
        }
    }
    return ops
}