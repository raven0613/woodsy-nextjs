// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Ihollow, Icomment, Iuser, errorResult, successResult } from '../../../../type-config'
import db from '../../../../models/index';
const DB: any = db;
const { Users, Articles, Comments, Hollows } = DB;

function getOffset (page: number, limit: number) {
  return (page - 1) * limit
}

export default function handleArticles(req: NextApiRequest, res: NextApiResponse<successResult | errorResult>) {
    switch (req.method) {
        case 'GET':
            getArticles(req, res)
            break
        default:
            res.status(405).end() //Method Not Allowed
            break
    }
}
export async function getArticles(req: NextApiRequest, res: NextApiResponse<successResult | errorResult>) {
  const { page: p, limit: l, id } = req.query;
  const page = Number(p), limit = Number(l), idNum = Number(id)
  try {
    const articles = await Articles.findAndCountAll({
      where: {
        hollow_id: idNum
      },
      include: [
        { model: Users, attributes: ['id', 'name'] }, 
        { model: Hollows, attributes: ['id', 'name'] }, 
        { model: Comments, attributes: ['id', 'content']},
        { model: Users, as: 'CollectedUsers', attributes: ['id', 'name'] },
        { model: Users, as: 'LikedUsers', attributes: ['id', 'name'] }
      ],
      limit,
      offset: getOffset(page, limit),
      nest: true, 
    })
    console.log(articles)
    res.status(200).json({ success: '查詢成功', payload: articles })  //回傳的是 count 和 data
  } catch (err) {
    return res.status(500).json({ error: '伺服器錯誤' })
  }
}