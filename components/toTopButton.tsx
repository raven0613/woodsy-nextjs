import { useRouter } from 'next/router'
import { Ihollow } from '../pages/home'


export default function ToTopButton () {
    function handleClick (e: React.MouseEvent) {
        e.stopPropagation()
        window.scrollTo(0, 0)
    }
    return (
        <button 
            className='fixed bottom-1.5 right-1.5 w-16 h-16 bg-slate-200'
            onClick={handleClick}>
            TOP
        </button>
    )
}