import { useRouter } from 'next/router'
import posts from '../../posts.json'

interface Iarticle {
    id: string,
    name: string,
    userId: string,
    content: string,
    isCollected: boolean,
    isLiked: boolean
}; 


export default function HollowList () {

    return (
        <>

        </>
    )
}