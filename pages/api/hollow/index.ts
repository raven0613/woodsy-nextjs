// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Ihollow, Icomment, Iuser } from '../../../type-config'
import db from '../../../models/index';
const DB: any = db;
const { Users, Articles, Comments, Hollows } = DB;

function getOffset (page: number, limit: number) {
  return (page - 1) * limit
}

export default async function getHollows(req: NextApiRequest, res: NextApiResponse<Ihollow[]>) {
  try {
    const { page: p, limit: l } = req.query;
    const page = Number(p), limit = Number(l)

    const hollows = await Hollows.findAndCountAll({
      include: [
        { model: Users, attributes: ['id', 'name'] }],
      limit,
      offset: getOffset(page, limit),
      nest: true, 
    }) as unknown as Ihollow[]  //TODO: 待刪

    if (hollows === null) return res.status(405).end('找不到樹洞')
    res.status(200).json(hollows)  //回傳的是 count 和 data
  } catch (err) {
    console.log(err)
  }

}
