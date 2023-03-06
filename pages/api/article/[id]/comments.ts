// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Icomment, Iuser, errorResult, successResult } from '../../../../type-config'
import db from '../../../../models/index';
// const DB: any = db;
const { Users, Articles, Comments, Hollows } = db;

function getOffset (page: number, limit: number) {
  return (page - 1) * limit
}

export default async function getComments(req: NextApiRequest, res: NextApiResponse<successResult | errorResult>) {
    const { id } = req.query
    const { page: p, limit: l } = req.query;
    const page = Number(p), limit = Number(l)

    try {
        const comments = await Comments.findAndCountAll({
            where: {
                article_id: id
            },
            include: [
                { model: Users, attributes: ['id', 'name'] },
                { model: Users, as: 'LikedUsers', attributes: ['id', 'name'] }
            ],
            limit,
            offset: getOffset(page, limit),
            nest: true,
        })
        res.status(200).json({ success: '搜尋成功', payload: JSON.parse(JSON.stringify(comments)) })  //回傳的是 count 和 data
    } catch (err) {
        return res.status(500).json({ error: '伺服器錯誤' })
    }
}