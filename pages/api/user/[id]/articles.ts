// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Sequelize } from 'sequelize';
import { Ihollow, Icomment, Iuser, errorResult, successResult } from '../../../../type-config'
import db from '../../../../models/index';
const DB: any = db;
const { Users, Articles, Comments, Hollows, Collections } = DB;

function getOffset (page: number, limit: number) {
  return (page - 1) * limit
}

export default function handleUserArticles(req: NextApiRequest, res: NextApiResponse<errorResult | successResult> ) {
  switch (req.method) {
      case 'GET':
          getUserArticles(req, res)
          break
      default:
          res.status(405).end() //Method Not Allowed
          break
  }
}

async function getUserArticles (req: NextApiRequest, res: NextApiResponse<errorResult | successResult>) {
    const { page: p, limit: l, id } = req.query;
    const page = Number(p), limit = Number(l), idNum = Number(id)
    if (!id || !p || !l) return res.status(500).json({ error: '請確認請求資料' })
    
    try {
        const articles = await Articles.findAll({
            where: { user_id: idNum },
            limit,
            offset: getOffset(page, limit),
            nest: true
        })
        return res.status(200).json({ success: '查詢成功', payload: articles }) 
    } catch (err) {
        return res.status(500).json({ error: '伺服器錯誤' })
    }
}