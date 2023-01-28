// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Ihollow, Icomment, Iuser } from '../../home'
import db from '../../../models/index';
const { Users, Articles } = db;


export default function handleUser(req: NextApiRequest, res: NextApiResponse<Iuser> ) {
  switch (req.method) {
      case 'GET':
          getUser(req, res)
          break
      case 'POST':
          addUser(req, res)
          break
      case 'PUT':
          editUser(req, res)
          break
      default:
          res.status(405).end() //Method Not Allowed
          break
  }
}

const currentUser: Iuser = {
    id: 'u1',
    name: '白文鳥',
    account: 'abc123',
    articles: 5,
    subHollows: 2,
    createAt: '20230106',
    role: 'user'
}

async function addUser (req: NextApiRequest, res: NextApiResponse<Iuser>) {
  console.log('add')
  res.status(200).json(currentUser)
}
async function editUser (req: NextApiRequest, res: NextApiResponse<Iuser>) {
    
  res.status(200).json(currentUser)
}

async function getUser (req: NextApiRequest, res: NextApiResponse<Iuser>) {
    const { id } = req.query
    const idNum = Number(id)
    const user = await Users.findByPk(idNum, {
        include: [
          { model: Articles, as: 'Articles' }
        ]
    })
    if (user === null) return res.status(405).end() //Method Not Allowed
    const userData: Iuser = user.toJSON()
    console.log(user)
    res.status(200).json(userData)
}