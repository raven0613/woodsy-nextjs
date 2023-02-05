// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Ihollow, Icomment, Iuser, errorMessage, successMessage } from '../../../type-config'
import db from '../../../models/index';
const DB: any = db;
const { Users, Articles, Comments, Hollows } = DB;

function getOffset (page: number, limit: number) {
  return (page - 1) * limit
}

export default function handleHollows(req: NextApiRequest, res: NextApiResponse<successMessage | errorMessage>) {
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

async function getHollows(req: NextApiRequest, res: NextApiResponse<successMessage | errorMessage>) {
  try {
    const { page: p, limit: l } = req.query;
    const page = Number(p), limit = Number(l)

    const hollows = await Hollows.findAndCountAll({
      include: [
        { model: Users, attributes: ['id', 'name'] }],
      limit,
      offset: getOffset(page, limit),
      nest: true, 
    })
    res.status(200).json({ success: '查詢成功', payload: hollows })  //回傳的是 count 和 data
  } catch (err) {
    return res.status(500).json({ error: '伺服器錯誤' } )
  }
}

async function addHollow (req: NextApiRequest, res: NextApiResponse<successMessage | errorMessage>) {
    const { name, type, article_counts, sub_counts, reported_counts, user_id } = req.body
    try {
        const hollow = await Hollows.create({
            name, 
            type, 
            article_counts, 
            sub_counts,
            reported_counts,
            user_id
        })

        if (hollow === null) return res.status(500).json({ error: '找不到樹洞' } )
        res.status(200).json({ success: '樹洞新增成功', payload: hollow })
    } catch (err) {
        return res.status(500).json({ error: '伺服器錯誤' } )
    }
}