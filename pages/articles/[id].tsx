import { useRouter } from 'next/router'
import posts from '../../posts.json'

interface Iarticle {
    id: string,
    title: string,
    hollowId: string,
    userId: string,
    content: string,
    comments: number,
    collectedCounts: number,
    likedCounts: number,
    reportedCounts: number,
    isCollected: boolean,
    isLiked: boolean,
    reportedAt: string,
    createdAt: string,
    hollowName?: string,
    description?: string
}; 
const dummyArticle: Iarticle = {
    id: 'a1',
    title: '找工作嗚嗚',
    hollowId: 'h1',
    userId: 'u1',
    content: '好想趕快找到工作，過年後就想要找工作懂否',
    comments: 2,
    collectedCounts: 20,
    likedCounts: 50,
    reportedCounts: 1,
    isCollected: false,
    isLiked: false,
    reportedAt: '20230105',
    createdAt: '20230105'
}

export default function Article () {

    return (
        <>

        </>
    )
}