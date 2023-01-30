// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Icomment, Iuser } from '../../../../type-config'


export default function getComments(req: NextApiRequest, res: NextApiResponse<Icomment[]>) {
    // const { id, page, limit } = req.query;
    // console.log('id: ' + id + ' page: '+ page + ' limit: ' + limit)
    res.status(200).json(comments)
}

let comments: Icomment[] = [
    {
        id: 1,
        articleId: 1,
        userId: 1,
        content: '年後比較好找啦',
        likedCounts: 10,
        reportedCounts: 0,
        isLiked: false,
        reportedAt: '',
        createdAt: '20230121'
    },
    {
        id: 2,
        articleId: 1,
        userId: 1,
        content: '我也好想要工作',
        likedCounts: 0,
        reportedCounts: 0,
        isLiked: false,
        reportedAt: '',
        createdAt: '20230121'
    },
    {
        id: 3,
        articleId: 1,
        userId: 1,
        content: '一起加油啊',
        likedCounts: 5,
        reportedCounts: 0,
        isLiked: false,
        reportedAt: '',
        createdAt: '20230121'
    },
]

export function addCom (comment: Icomment) {
    comments = [...comments, comment]
}
export function delCom (commentId: number) {
    comments = comments.filter(com => com.id !== commentId)
}
export function editCom (comment: Icomment) {
    comments = comments.map(com => {
        if (com.id === comment.id) {
            return { ...com, content: comment.content}
        }
        return { ...com }
    })
}