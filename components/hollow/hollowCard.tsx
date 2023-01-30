import { useRouter } from 'next/router'
import { Ihollow } from '../../type-config'


interface hollowProps {
  hollow: Ihollow
}

export default function HollowCard ({ hollow }: hollowProps) {
    return (
        <div className='bg-gray-50 rounded-lg py-3 px-4 h-28'>
            <h2>{hollow.name}</h2>
            <p>文章數：{hollow.article}</p>
            {hollow.isSub && <p>已關注</p>}
        </div>
    )
}