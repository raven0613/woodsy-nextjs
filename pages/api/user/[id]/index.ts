// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from "next-auth/next"
import { authOptions } from '../../auth/[...nextauth]'

import { Sequelize } from 'sequelize';
import { Ihollow, Icomment, Iuser, errorResult, successResult } from '../../../../type-config'
import db from '../../../../models/index';
const DB: any = db;
const { Users, Articles, Comments, Hollows } = DB;
import bcrypt from 'bcrypt';
const saltRounds = 10;

export default function handleUser(req: NextApiRequest, res: NextApiResponse<successResult | errorResult> ) {
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

async function editUser (req: NextApiRequest, res: NextApiResponse<successResult | errorResult>) {
    const session = await getServerSession(req, res, authOptions)
    if (!session) return res.status(401).json({ error: '請先登入' })

    const { id } = req.query
    const idNum = Number(id)
    const { name, email, password, role, birthday } = req.body

    if (idNum !== session.user.id && session.user.role !== 'admin') return res.status(401).json({ error: '使用者身分不符' })
    const t = await new Sequelize(process.env.MYSQL_DATABASE || '', process.env.MYSQL_USER || '', process.env.MYSQL_PASSWORD, {
        host: process.env.MYSQL_HOST,
        dialect: 'mysql'
    }).transaction();
    try {
        const user = await Users.findByPk(idNum, { transaction: t })
        if (!user) return res.status(500).json({ error: '找不到使用者' })
        let editedPassword = ''
        if (password) {
            editedPassword = await bcrypt.hash(password, saltRounds)
        }
        // 密碼沒變的話就沿用原本的
        user.set({ name, email, password: editedPassword || user.password, role, birthday }, { transaction: t })
        await user.save({ transaction: t })
        await t.commit();

        const userWithoutPassword: Iuser = { id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt, updatedAt: user.updatedAt, birthday: user.birthday }
        
        res.status(200).json({ success: '編輯使用者資料成功', payload: userWithoutPassword })
        
    } catch (err) {
        await t.rollback();
        return res.status(500).json({ error: '伺服器錯誤' })
    }
}

async function getUser (req: NextApiRequest, res: NextApiResponse<successResult | errorResult>) {
    const { id } = req.query
    const idNum = Number(id)
    try {
        const user = await Users.findByPk(idNum, {
            attributes: ['id', 'name', 'email', 'role', 'createdAt', 'updatedAt'],
            raw: true,
            nest: true
        })
        if (!user) return res.status(500).json({ error: '找不到使用者' })
        const articleCounts = await Articles.count({
            where: { user_id: idNum }
        })
        const userResult = { ...user, articleCounts: articleCounts? articleCounts : 0 }
        res.status(200).json({ success: '查詢成功', payload: userResult })
    } catch (err) {
        return res.status(500).json({ error: '伺服器錯誤' })
    }
}