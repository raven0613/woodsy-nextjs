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
        <div className='fixed inset-x-0 top-0 bg-slate-100 h-16 pl-6'>
            <Link href={`/home`}>
                <span className='font-sans text-neutral-600 text-3xl font-bold leading-loose'>Woodsy</span>
            </Link>
            {session && <button className='border' onClick={handleLogout}>登出</button>}
            {!session && <button className='border' onClick={handleLogout}>登入</button>}
        </div>
    )
}