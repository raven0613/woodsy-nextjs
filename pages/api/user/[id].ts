// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Ihollow, Icomment, Iuser } from '../../../type-config'
import db from '../../../models/index';
const DB: any = db;
const { Users, Articles, Comments, Hollows } = DB;


export default function handleUser(req: NextApiRequest, res: NextApiResponse<Iuser> ) {
  switch (req.method) {
      case 'GET':
          getUser(req, res)
          break
      case 'PUT':
          // editUser(req, res)
          break
      default:
          res.status(405).end() //Method Not Allowed
          break
  }
}

// async function editUser (req: NextApiRequest, res: NextApiResponse<Iuser>) {
    
//   res.status(200).json(currentUser)
// }

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