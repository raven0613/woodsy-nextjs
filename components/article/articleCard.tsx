import { useRouter } from 'next/router'
import { Iarticle } from '../../pages/home'

interface articleProps {
  art: Iarticle
}

export default function ArticleCard ({ art }: articleProps) {
    return (
        <div className='m-auto bg-gray-50 py-3 px-5 my-3 rounded-lg'>
            <p className='text-gray-700 text-xl font-bold'>{art.title}</p>
            <p className='text-gray-500'>{art.description}</p>
            <p>回應數：{art.comments}</p>
            <span className='border rounded border-lime-500 text-lime-500 px-1.5 py-0.5'>{art.hollowName}</span>
        </div>
    )
}