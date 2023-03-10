import { useRouter } from 'next/router'
import { Ihollow } from '../../type-config'


interface hollowProps {
  hollow: Ihollow
  handleSub: (hollowId: number, isSub: boolean) => void
}

export default function HollowCard ({ hollow, handleSub }: hollowProps) {

    function handleClick (e: React.MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        if (!hollow.id || hollow.isSub === undefined) return
        handleSub(hollow.id, hollow.isSub)
    }
    return (
        <div className='border rounded-lg py-3 px-4 h-28 hover:bg-gray-50 ease-out duration-300'>
            <div className='flex justify-between'>
                <h1 className='text-gray-600 text-lg font-bold'>{hollow.name}</h1>
                {!hollow.isSub && <button onClick={handleClick} className='w-6 h-6 border rounded-full'></button>}
                {hollow.isSub && <button onClick={handleClick} className='w-6 h-6 bg-lime-500 rounded-full'></button>}
            </div>
            <p>文章數：{hollow.articleCounts}</p>
            <p>關注數：{hollow.subCounts}</p>
        </div>
    )
}