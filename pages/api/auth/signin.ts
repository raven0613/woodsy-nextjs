// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Ihollow, Icomment, Iuser } from '../../../type-config'
import db from '../../../models/index';
const { Users, Articles, Comments } = db;
import bcrypt from 'bcrypt';
const saltRounds = 10;

export default async function signin(req: NextApiRequest, res: NextApiResponse<Iuser> ) {
  const userData = req.body

  try {
    let existUser = await Users.findOne({
      where: {
        account: userData.account
      },
      raw: true,
      nest: true
    })
    if (existUser === null) return res.status(405).end('請確認您的登入資訊')

    let isCorrect = await bcrypt.compare(userData.password, existUser.password)
    if (isCorrect) return res.status(200).json(existUser)

    res.status(405).end('請確認您的登入資訊')
  } catch (err) {
    console.log(err)
  }
}