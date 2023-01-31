import { useRouter } from 'next/router'
import Link from 'next/link'
import { Iarticle } from '../type-config'
import { useSession, signOut } from "next-auth/react"


export default function Navbar () {
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
        },
    })
    function handleLogout () {
        signOut({ callbackUrl: 'http://localhost:3000/login' })
    }
    return (
        <div className='fixed inset-x-0 top-0 bg-slate-100 h-16 pl-6 flex justify-between items-center'>
            <Link href={`/home`}>
                <span className='font-sans text-neutral-600 text-3xl font-bold leading-loose'>Woodsy</span>
            </Link>
            <div className='mr-4'>
                {!session && <Link href={`/login`}>
                    <span className='font-sans text-neutral-600 text-xl font-bold leading-loose'>登入</span>
                </Link>}
                {session && <button className='font-sans text-neutral-600 text-xl font-bold leading-loose' onClick={handleLogout}>登出</button>}
            </div>
        </div>
    )
}