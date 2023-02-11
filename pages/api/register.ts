// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Sequelize } from 'sequelize';
import { Ihollow, Icomment, Iuser, ILoginuser, errorResult, successResult } from '../../type-config'
import db from '../../models/index';
const DB: any = db;
const { Users, Articles, Comments, Hollows } = DB;
import bcrypt from 'bcrypt';
const saltRounds = 10;


export default async function register(req: NextApiRequest, res: NextApiResponse<successResult | errorResult> ) {
  const userData = req.body
  const t = await new Sequelize(process.env.MYSQL_DATABASE || '', process.env.MYSQL_USER || '', process.env.MYSQL_PASSWORD, {
      host: process.env.MYSQL_HOST,
      dialect: 'mysql'
  }).transaction();

  try {
    const password = await bcrypt.hash(userData.password, saltRounds)

    let existUser = await Users.findOne({
      where: {
        email: userData.email,
        account: userData.account
      },
      raw: true,
      nest: true
    }, { transaction: t })
    if (existUser) return res.status(403).json({ error: '使用者已存在' })
    let user = await Users.create({...userData, password }, { transaction: t })
    await t.commit();
    if (!user) return res.status(500).json({ error: '新增使用者失敗' })
    res.status(200).json({ success: '註冊成功', payload: user })
  } catch (err) {
      await t.rollback();
      return res.status(500).json({ error: '伺服器錯誤' })
  }
}