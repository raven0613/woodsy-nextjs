import { useRouter } from 'next/router'
import Link from 'next/link'
import { Icomment } from '../pages/home'

interface commentProps {
  comment: Icomment
}

export default function CommentCard ({ comment }: commentProps) {
    return (
        <div className='w-full border-b px-4 py-2'>
            <span>白文鳥</span>
            <span className='text-sm text-slate-300'>@Vg2X8</span>
            <p className='py-2 whitespace-pre-wrap'>
                {comment.content}
            </p>
        </div>
    )
}