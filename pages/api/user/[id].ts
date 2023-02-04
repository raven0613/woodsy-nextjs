// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Sequelize } from 'sequelize';
import { Ihollow, Icomment, Iuser, errorMessage } from '../../../type-config'
import db from '../../../models/index';
const DB: any = db;
const { Users, Articles, Comments, Hollows } = DB;
import bcrypt from 'bcrypt';
const saltRounds = 10;

export default function handleUser(req: NextApiRequest, res: NextApiResponse<Iuser | errorMessage> ) {
  switch (req.method) {
      case 'GET':
          getUser(req, res)
          break
      case 'PUT':
          editUser(req, res)
          break
      default:
          res.status(405).end() //Method Not Allowed
          break
  }
}

async function editUser (req: NextApiRequest, res: NextApiResponse<Iuser | errorMessage>) {
    const { id } = req.query
    const idNum = Number(id)
    const { name, account, email, password } = req.body

    const t = await new Sequelize('woodsy_nextjs', 'root', process.env.SEQUELIZE_PASSWORD, {
        host: 'localhost',
        dialect: 'mysql'
    }).transaction();

    try {
        const editedPassword = await bcrypt.hash(password, saltRounds)

        const user = await Users.findByPk(idNum, { transaction: t })

        user.set({ name, account, email, editedPassword }, { transaction: t })
        await user.save({ transaction: t })
        await t.commit();

        if (!user) return res.status(500).json({ error: '找不到使用者' })
        res.status(200).json(user)
    } catch (err) {
        await t.rollback();
        return res.status(500).json({ error: '伺服器錯誤' })
    }
}

async function getUser (req: NextApiRequest, res: NextApiResponse<Iuser | errorMessage>) {
    const { id } = req.query
    const idNum = Number(id)
    try {
        // TODO: 之後要加上 articleCounts
        const user = await Users.findByPk(idNum, {
            attributes: ['id', 'name', 'account', 'email', 'role', 'createdAt', 'updatedAt'],
            raw: true,
            nest: true
        })
        if (!user) return res.status(500).json({ error: '找不到使用者' })
        res.status(200).json(user)
    } catch (err) {
        return res.status(500).json({ error: '伺服器錯誤' })
    }
}