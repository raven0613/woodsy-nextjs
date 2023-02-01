// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Ihollow, Icomment, Iuser, ILoginuser } from '../../type-config'
import db from '../../models/index';
const DB: any = db;
const { Users, Articles, Comments, Hollows } = DB;
import bcrypt from 'bcrypt';
const saltRounds = 10;


export default async function register(req: NextApiRequest, res: NextApiResponse<Iuser> ) {
  const userData = req.body
  try {
    const password = await bcrypt.hash(userData.password, saltRounds)

    let existUser = await Users.findOne({
      where: {
        email: userData.email,
        account: userData.account
      },
      raw: true,
      nest: true
    })
    if (existUser) return res.status(403).end()
    let user: Iuser = await Users.create({...userData, password }) as unknown as Iuser

    if (user === null) return res.status(405).end()
    res.status(200).json(user)
  } catch (err) {
    console.log(err)
  }
}