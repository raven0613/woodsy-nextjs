import { useRouter } from 'next/router'
import { Ihollow } from '../../type-config'


interface hollowProps {
  hollow: Ihollow
}

export default function hollowDetailCard ({ hollow }: hollowProps) {
    return (
        <div className='flex-1 bg-gray-50 rounded-lg py-3 px-4'>
            <h2>{hollow.name}</h2>
            <p>文章數：{hollow.article}</p>
            {hollow.isSub && <p>已訂閱</p>}
        </div>
    )
}