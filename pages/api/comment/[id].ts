// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Iarticle, Icomment, Iuser } from '../../home'

export default function handleComments(req: NextApiRequest, res: NextApiResponse<Icomment>) {
    switch (req.method) {
        case 'PUT':
            editComment(res)
            break
        case 'DELETE':
            deleteComment(res)
            break
        default:
            res.status(405).end() //Method Not Allowed
            break
    }
}

function editComment (res: NextApiResponse<Icomment>) {
    console.log('put')
    res.status(200).json(comment)
}

function deleteComment (res: NextApiResponse<Icomment>) {
    console.log('delete')
    res.status(200).json(comment)
}

const comment: Icomment = {
    id: 'c1',
    articleId: 'a1',
    userId: 'u1',
    content: '年後比較好找啦',
    likedCounts: 10,
    reportedCounts: 0,
    isLiked: false,
    reportedAt: '',
    createdAt: '20230121'
}

const comments: Icomment[] = [
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