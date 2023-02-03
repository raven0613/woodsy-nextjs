// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Icomment, Iuser, errorMessage } from '../../../../type-config'
import db from '../../../../models/index';
const DB: any = db;
const { Users, Articles, Comments, Hollows } = DB;

function getOffset (page: number, limit: number) {
  return (page - 1) * limit
}

export default async function getComments(req: NextApiRequest, res: NextApiResponse<Icomment[] | errorMessage>) {
    const { id } = req.query
    const { page: p, limit: l } = req.query;
    const page = Number(p), limit = Number(l)

    try {
        const comments = await Comments.findAndCountAll({
            where: {
                article_id: id
            },
            include: { model: Users, attributes: ['id', 'name'] },
            limit,
            offset: getOffset(page, limit),
            nest: true,
        })
        if (!comments.count) return res.status(500).json({ error: '找不到評論' })
        res.status(200).json(comments)  //回傳的是 count 和 data
    } catch (err) {
        return res.status(500).json({ error: '伺服器錯誤' })
    }
}


// export function addCom(comment: Icomment) {
//     comments = [...comments, comment]
// }
// export function delCom(commentId: number) {
//     comments = comments.filter(com => com.id !== commentId)
// }
// export function editCom(comment: Icomment) {
//     comments = comments.map(com => {
//         if (com.id === comment.id) {
//             return { ...com, content: comment.content }
//         }
//         return { ...com }
//     })
// }