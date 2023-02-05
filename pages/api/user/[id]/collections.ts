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

export default function handleUserCollections(req: NextApiRequest, res: NextApiResponse<Iuser | errorResult | successResult> ) {
  switch (req.method) {
      case 'GET':
          getUserCollections(req, res)
          break
      default:
          res.status(405).end() //Method Not Allowed
          break
  }
}


async function getUserCollections (req: NextApiRequest, res: NextApiResponse<Iuser | errorResult | successResult>) {
    const { page: p, limit: l, id } = req.query;
    const page = Number(p), limit = Number(l), idNum = Number(id)
    if (!id || !p || !l) return res.status(500).json({ error: '請確認請求資料' })
    try {
        const collections = await Collections.findAll({
            where: { user_id: idNum },
            include: [
                { model: Articles }],
            limit,
            offset: getOffset(page, limit),
            nest: true
        })
        return res.status(200).json({ success: '查詢成功', payload: collections }) 
    } catch (err) {
        return res.status(500).json({ error: '伺服器錯誤' })
    }
}