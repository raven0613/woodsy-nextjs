// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from "next-auth/next"
import { authOptions } from '../../auth/[...nextauth]'

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
    const session = await getServerSession(req, res, authOptions)
    if (!session) return res.status(401).json({ error: '請先登入' })

    const { page: p, limit: l, id } = req.query;
    const page = Number(p), limit = Number(l), idNum = Number(id)
    if (!id || !p || !l) return res.status(400).json({ error: '請確認請求資料' })

    if (idNum !== session.user.id && session.user.role !== 'admin') return res.status(401).json({ error: '使用者身分不符' })
    try {
        const articles = await Articles.findAll({
            where: { user_id: idNum },
            include: [
                { model: Users},
                { model: Users, as: 'CollectedUsers'},
                { model: Users, as: 'LikedUsers'},
                { model: Hollows},
            ],
            limit,
            offset: getOffset(page, limit),
            nest: true
        })
        return res.status(200).json({ success: '查詢成功', payload: articles }) 
        
    } catch (err) {
        return res.status(500).json({ error: '伺服器錯誤' })
    }
}