import { useRouter } from 'next/router'
import { Ihollow } from '../../type-config'


interface hollowProps {
  hollow: Ihollow
}

export default function HollowCard ({ hollow }: hollowProps) {
    console.log(hollow)
    return (
        <div className='bg-gray-50 rounded-lg py-3 px-4 h-28'>
            <h1 className='text-gray-600 text-lg font-bold'>{hollow.name}</h1>
            <p>文章數：{hollow.articleCounts}</p>
            <p>關注數：{hollow.subCounts}</p>
            {hollow.isSub && <p>已關注</p>}
        </div>
    )
}