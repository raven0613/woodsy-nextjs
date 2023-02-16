// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Ihollow, Icomment, Iuser, errorResult, successResult } from '../../../type-config'
import db from '../../../models/index';
const DB: any = db;
const { Users, Articles, Comments, Hollows } = DB;


export default function handleUsers(req: NextApiRequest, res: NextApiResponse<successResult | errorResult>) {
    switch (req.method) {
        case 'GET':
            getUsers(res)
            break
        default:
            res.status(405).end() //Method Not Allowed
            break
    }
}

async function getUsers(res: NextApiResponse<successResult | errorResult> ) {
  try {
    const users: Iuser[] = await Users.findAll({
      attributes: ['id', 'name', 'account', 'email', 'role', 'createdAt', 'updatedAt'],
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