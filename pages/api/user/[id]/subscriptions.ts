// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Sequelize } from 'sequelize';
import { Ihollow, Icomment, Iuser, errorResult, successResult } from '../../../../type-config'
import db from '../../../../models/index';
const DB: any = db;
const { Users, Articles, Comments, Hollows, Subscriptions } = DB;

function getOffset (page: number, limit: number) {
  return (page - 1) * limit
}

export default function handleUserSubscriptions(req: NextApiRequest, res: NextApiResponse<errorResult | successResult> ) {
  switch (req.method) {
      case 'GET':
          getUserSubscriptions(req, res)
          break
      default:
          res.status(405).end() //Method Not Allowed
          break
  }
}

async function getUserSubscriptions (req: NextApiRequest, res: NextApiResponse<errorResult | successResult>) {
    const { page: p, limit: l, id } = req.query;
    const page = Number(p), limit = Number(l), idNum = Number(id)
    if (!id || !p || !l) return res.status(500).json({ error: '請確認請求資料' })
    try {
        const subscriptions = await Hollows.findAll({
            include: [
                { model: Users, as: 'SubUsers', where: { id: idNum }}
            ],
            limit,
            offset: getOffset(page, limit),
            nest: true
        })
        return res.status(200).json({ success: '查詢成功', payload: subscriptions }) 
        
    } catch (err) {
        return res.status(500).json({ error: '伺服器錯誤' })
    }
}