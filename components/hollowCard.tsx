import { useRouter } from 'next/router'

interface Ihollow {
    id: string,
    name: string,
    article: number,
    isSub: boolean
};

interface hollowProps {
  hollow: Ihollow
}

export default function HollowCard ({ hollow }: hollowProps) {
    return (
        <div>
            <h2>{hollow.name}</h2>
            <p>文章數：{hollow.article}</p>
            {hollow.isSub && <p>已訂閱</p>}
        </div>
    )
}