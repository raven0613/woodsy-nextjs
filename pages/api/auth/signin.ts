// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Ihollow, Icomment, Iuser, successResult, errorResult } from '../../../type-config'
import db from '../../../models/index';
import bcrypt from 'bcrypt';

const DB: any = db;
const { Users } = DB;


export default async function signin(req: NextApiRequest, res: NextApiResponse<successResult | errorResult> ) {
  const userData = req.body

  try {
    let existUser = await Users.findOne({
      where: {
        account: userData.account
      },
      raw: true,
      nest: true
    })
    if (!existUser) return res.status(403).json({ error: '請確認您的登入資訊' })

    let isCorrect = await bcrypt.compare(userData.password, existUser.password)
    if (!isCorrect) return res.status(403).json({ error: '請確認您的登入資訊' })

    const user = await Users.findOne({
      where: { account: userData.account }
    })
    if (!user) return res.status(403).json({ error: '登入失敗' })

    return res.status(200).json({ success: '登入成功', payload: user })
  } catch (err) {
    return res.status(500).json({ error: '伺服器錯誤' })
  }
}