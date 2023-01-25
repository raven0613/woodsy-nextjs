// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Iarticle, Icomment, Iuser } from '../../home'

export default function addComment(req: NextApiRequest, res: NextApiResponse<Icomment>) {
    if (req.method !== 'POST') return res.status(405).end() //Method Not Allowed
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
