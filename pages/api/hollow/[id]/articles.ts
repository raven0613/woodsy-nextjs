// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Ihollow, Icomment, Iuser, errorMessage } from '../../../../type-config'
import db from '../../../../models/index';
import { Iarticle } from '../../../../type-config';
const DB: any = db;
const { Users, Articles, Comments, Hollows } = DB;

function getOffset (page: number, limit: number) {
  return (page - 1) * limit
}

export default function handleArticles(req: NextApiRequest, res: NextApiResponse<Iarticle[] | errorMessage>) {
    console.log(req)
    switch (req.method) {
        case 'GET':
            getArticles(req, res)
            break
        default:
            res.status(405).end() //Method Not Allowed
            break
    }
}
export async function getArticles(req: NextApiRequest, res: NextApiResponse<Iarticle[] | errorMessage>) {
  const { id } = req.query
  const { page: p, limit: l } = req.query;
  const page = Number(p), limit = Number(l)

  try {
    const articles = await Articles.findAndCountAll({
      where: {
        hollow_id: id
      },
      include: [
        { model: Users, attributes: ['id', 'name'] }, 
        { model: Comments, attributes: ['id', 'content'] }],
      limit,
      offset: getOffset(page, limit),
      nest: true, 
    })
    if (!articles.count) return res.status(500).json({ error: '找不到文章' })
    res.status(200).json(articles)  //回傳的是 count 和 data
  } catch (err) {
    return res.status(500).json({ error: '伺服器錯誤' })
  }
}