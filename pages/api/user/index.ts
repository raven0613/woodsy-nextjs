// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Ihollow, Icomment, Iuser } from '../../../type-config'
import db from '../../../models/index';
const DB: any = db;
const { Users, Articles, Comments, Hollows } = DB;
import bcrypt from 'bcrypt';
const saltRounds = 10;


export default function handleUsers(req: NextApiRequest, res: NextApiResponse<Iuser[]>) {
    switch (req.method) {
        case 'GET':
            getUsers(res)
            break
        default:
            res.status(405).end() //Method Not Allowed
            break
    }
}

async function getUsers(res: NextApiResponse<Iuser[]> ) {
  try {
    const users: Iuser[] = await Users.findAll({
      where: { role: 'user' }
    })
    console.log(users)
    if (users === null) return res.status(405).end({ message: '找不到使用者' })
    res.status(200).json(users)
  } catch (err) {
    console.log(err)
  }
}

export const currentUser: Iuser = {
  id: 1,
  name: '白文鳥',
  account: 'abc123',
  articles: 5,
  subHollows: 2,
  createAt: '20230106',
  role: 'user',
  email: '',
  password: ''
}

