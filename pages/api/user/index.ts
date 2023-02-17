// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from "next-auth/next"
import { authOptions } from '../auth/[...nextauth]'

import { Ihollow, Icomment, Iuser, errorResult, successResult } from '../../../type-config'
import db from '../../../models/index';
const DB: any = db;
const { Users, Articles, Comments, Hollows } = DB;


export default function handleUsers(req: NextApiRequest, res: NextApiResponse<successResult | errorResult>) {
    switch (req.method) {
        case 'GET':
            getUsers(req, res)
            break
        default:
            res.status(405).end() //Method Not Allowed
            break
    }
}

async function getUsers(req: NextApiRequest, res: NextApiResponse<successResult | errorResult> ) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(401).json({ error: '請先登入' })
  try {
    const users: Iuser[] = await Users.findAll({
      attributes: ['id', 'name', 'email', 'role', 'createdAt', 'updatedAt'],
      include: { model: Articles, attributes: ['id'] },
      where: { role: 'user' },
      nest: true,
      raw: true
    })
    res.status(200).json({ success: '查詢成功', payload: users })
  } catch (err) {
    return res.status(500).json({ error: '伺服器錯誤' })
  }
}