import { useRouter } from 'next/router'
import Navbar from '../../components/navbar'
import { Iarticle, Icomment } from '../home'
import CommentCard from "../../components/commentCard"

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
const dummyComments: Icomment[] = [
    {
        id: 'c1',
        articleId: 'a1',
        userId: 'u1',
        content: '年後比較好找啦',
        likedCounts: 10,
        reportedCounts: 0,
        isLiked: false,
        reportedAt: '',
        createdAt: '20230121'
    },
    {
        id: 'c2',
        articleId: 'a1',
        userId: 'u1',
        content: '我也好想要工作',
        likedCounts: 0,
        reportedCounts: 0,
        isLiked: false,
        reportedAt: '',
        createdAt: '20230121'
    },
    {
        id: 'c3',
        articleId: 'a1',
        userId: 'u1',
        content: '一起加油啊',
        likedCounts: 5,
        reportedCounts: 0,
        isLiked: false,
        reportedAt: '',
        createdAt: '20230121'
    },
]


export default function Article () {

    return (
        <>
            <Navbar />
            {dummyArticle && <div className='mt-20 mx-2 w-full md:mx-auto md:w-4/5 lg:w-3/5'>
                <h1 className='text-2xl font-semibold'>{dummyArticle.title}</h1>
                <article>{dummyArticle.content}</article>
                
                <div className='w-full'>
                    {dummyComments && dummyComments.map(comment => {
                        return (
                            <CommentCard comment={comment} key={comment.id}/>
                        )
                    })}
                </div>
            </div>}
        </>
    )
}