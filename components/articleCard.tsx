import { useRouter } from 'next/router'
import { Iarticle } from '../pages/index'

interface articleProps {
  art: Iarticle
}

export default function ArticleCard ({ art }: articleProps) {
    return (
        <div>
            <h3>{art.title}</h3>
            <p>{art.description}</p>
            <h4>樹洞：{art.hollowName}</h4>
            <p>回應數：{art.comments}</p>
        </div>
    )
}