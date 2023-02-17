// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from "next-auth/next"
import { authOptions } from '../auth/[...nextauth]'

import { Sequelize } from 'sequelize';
import { Iarticle, Icomment, Iuser, errorResult, successResult } from '../../../type-config'
import db from '../../../models/index';
const DB: any = db;
const { Users, Articles, Comments, Hollows } = DB;

export default function handleComments(req: NextApiRequest, res: NextApiResponse<successResult | errorResult>) {
    switch (req.method) {
        case 'POST':
            addComment(req, res)
            break
        default:
            res.status(405).end() //Method Not Allowed
            break
    }
}


async function addComment(req: NextApiRequest, res: NextApiResponse<successResult | errorResult>) {
    const session = await getServerSession(req, res, authOptions)
    if (!session) return res.status(401).json({ error: '請先登入' })

    if (req.method !== 'POST') return res.status(405).end() //Method Not Allowed
    const { content, user_id, article_id} = req.body
    if (!content || content.length > 500 || !user_id || !article_id) return res.status(500).json({ error: '請求的內容不正確' })

    const t = await new Sequelize(process.env.MYSQL_DATABASE || '', process.env.MYSQL_USER || '', process.env.MYSQL_PASSWORD, {
        host: process.env.MYSQL_HOST,
        dialect: 'mysql'
    }).transaction();
    try {
        const comment = await Comments.create({content, user_id, article_id }, { transaction: t })
        if (!comment) return res.status(500).json({ error: '新增回覆失敗' })
        
        const article = await Articles.findByPk(article_id, { transaction: t })
        if (article) {
            await Articles.increment({comment_counts: 1}, { where: { id: article_id }, transaction: t })
        }
        
        await t.commit();
        res.status(200).json({ success: '新增回覆成功', payload: comment })
    } catch (err) {
        await t.rollback();
        return res.status(500).json({ error: '伺服器錯誤' })
    }
}