import { useRouter } from 'next/router'
import Link from 'next/link'
import { Iarticle } from '../type-config'


export default function Navbar () {
    return (
        <div className='fixed inset-x-0 top-0 bg-slate-100 h-16 pl-6'>
            <Link href={`/home`}>
                <span className='font-sans text-neutral-600 text-3xl font-bold leading-loose'>Woodsy</span>
            </Link>

        </div>
    )
}