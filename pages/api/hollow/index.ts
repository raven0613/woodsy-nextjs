// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from "next-auth/next"
import { authOptions } from '../auth/[...nextauth]'

import { Op } from 'sequelize'
import { Ihollow, Icomment, Iuser, errorResult, successResult } from '../../../type-config'
import db from '../../../models/index';
import { subscribeCallback } from 'swr/_internal';
const DB: any = db;
const { Users, Articles, Comments, Hollows, Subscriptions } = DB;

function getOffset(page: number, limit: number) {
  return (page - 1) * limit
}

export default function handleHollows(req: NextApiRequest, res: NextApiResponse<successResult | errorResult>) {
  switch (req.method) {
    case 'GET':
      getHollows(req, res)
      break
    case 'POST':
      addHollow(req, res)
      break
    default:
      res.status(405).end() //Method Not Allowed
      break
  }
}

async function getHollows(req: NextApiRequest, res: NextApiResponse<successResult | errorResult>) {
  try {
    const { page: p, limit: l, keyword } = req.query;
    const page = Number(p), limit = Number(l)

    const hollows = await Hollows.findAndCountAll({
      where: { name: {[Op.like]: `%${keyword}%`} },
      include: [
        { model: Users, attributes: ['id', 'name'] },
        { model: Users, as: 'SubUsers', attributes: ['id', 'name'] }
      ],
      limit,
      offset: getOffset(page, limit),
      nest: true,
      order: [
        ['article_counts', 'DESC'],
        ['id', 'ASC']
      ]
    })
    res.status(200).json({ success: '查詢成功', payload: hollows })  //回傳的是 count 和 data
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: '伺服器錯誤' })
  }
}

async function addHollow(req: NextApiRequest, res: NextApiResponse<successResult | errorResult>) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(401).json({ error: '請先登入' })

  const { name, type, user_id } = req.body
  try {
    if (!name || !type || !user_id) return res.status(500).json({ error: '請確認資料格式' })
    const hollow = await Hollows.create({
      name,
      type,
      user_id
    })

    if (!hollow) return res.status(500).json({ error: '找不到樹洞' })
    res.status(200).json({ success: '樹洞新增成功', payload: hollow })

  } catch (err) {
    return res.status(500).json({ error: '伺服器錯誤' })
  }
}