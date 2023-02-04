// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Sequelize } from 'sequelize';
import { Iarticle, Icomment, Iuser, errorMessage } from '../../../type-config'
import db from '../../../models/index';
const DB: any = db;
const { Users, Articles, Comments, Hollows } = DB;

export default async function addComment(req: NextApiRequest, res: NextApiResponse<Icomment | errorMessage>) {
    if (req.method !== 'POST') return res.status(405).end() //Method Not Allowed
    const { content, user_id, article_id} = req.body
    const t = await new Sequelize('woodsy_nextjs', 'root', process.env.SEQUELIZE_PASSWORD, {
        host: 'localhost',
        dialect: 'mysql'
    }).transaction();
    try {
        const comment = await Comments.create({content, user_id, article_id }, { transaction: t })
        if (!comment) return res.status(500).json({ error: '新增使用者失敗' })
        await t.commit();
        res.status(200).json(comment)
    } catch (err) {
        await t.rollback();
        return res.status(500).json({ error: '伺服器錯誤' })
    }
}