import { useRouter } from 'next/router'

export default function ToTopButton () {
    function handleClick (e: React.MouseEvent) {
        e.stopPropagation()
        window.scrollTo(({
            top: 0,
            behavior: 'smooth',
        }))
    }
    return (
        <button 
            className='fixed bottom-1.5 right-1.5 w-16 h-16 bg-slate-200 rounded-lg z-10'
            onClick={handleClick}>
            TOP
        </button>
    )
}