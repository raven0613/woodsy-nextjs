// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from "next-auth/next"
import { authOptions } from '../auth/[...nextauth]'

import { Sequelize } from 'sequelize';
import { Ihollow, Icomment, Iuser, ICollection, errorResult, successResult, ILikeship } from '../../../type-config'
import db from '../../../models/index';
const DB: any = db;
const { Users, Articles, Comments, Hollows, Collections } = DB;

export default async function handleLikeship(req: NextApiRequest, res: NextApiResponse<errorResult | successResult>) {

    
    switch (req.method) {
        case 'POST':
            addCollection(req, res)
            break
        case 'DELETE':
            deleteCollection(req, res)
            break
        default:
            res.status(405).end() //Method Not Allowed
            break
    }
}

async function addCollection (req: NextApiRequest, res: NextApiResponse<errorResult | successResult>) {
    const session = await getServerSession(req, res, authOptions)
    if (!session) return res.status(401).json({ error: '請先登入' })

    const { user_id, article_id } = req.body
    if (user_id !== session.user.id) return res.status(401).json({ error: '使用者身分不符' })
    if (!user_id || !article_id) return res.status(400).json({ error: '請確認請求資料' })

    const t = await new Sequelize(process.env.MYSQL_DATABASE || '', process.env.MYSQL_USER || '', process.env.MYSQL_PASSWORD, {
        host: process.env.MYSQL_HOST,
        dialect: 'mysql'
    }).transaction();

    try {
        const existCollection = await Collections.findOne({
            where: {
                user_id, article_id
            }
        }, { transaction: t })
        if (existCollection) return res.status(403).json({ error: '已存在相同紀錄' })

        const collection = await Collections.create({
            user_id, article_id
        }, { transaction: t })
        if (!collection) return res.status(500).json({ error: '記錄新增失敗' })

        const article = await Articles.findByPk(article_id, { transaction: t })
        if (article) {
            await Articles.increment({collected_counts: 1}, {where: { id: article_id }, transaction: t})
        }
        
        await t.commit();
        return res.status(200).json({ success: '收藏成功', payload: collection })
    } catch (err) {
        await t.rollback();
        return res.status(500).json({ error: '伺服器錯誤' })
    }
}

async function deleteCollection (req: NextApiRequest, res: NextApiResponse<errorResult | successResult>) {
    const session = await getServerSession(req, res, authOptions)
    if (!session) return res.status(401).json({ error: '請先登入' })

    const { user_id, article_id } = req.body
    if (user_id !== session.user.id) return res.status(401).json({ error: '使用者身分不符' })
    if (!user_id || !article_id) return res.status(500).json({ error: '請確認請求資料' })

    const t = await new Sequelize(process.env.MYSQL_DATABASE || '', process.env.MYSQL_USER || '', process.env.MYSQL_PASSWORD, {
        host: process.env.MYSQL_HOST,
        dialect: 'mysql'
    }).transaction();

    try {
        const existCollection = await Collections.destroy({
            where: {
                user_id, article_id
            }
        }, { transaction: t })
        if (!existCollection) return res.status(404).json({ error: '此紀錄不存在' })

        const article = await Articles.findByPk(article_id, { transaction: t })
        if (article) {
            await Articles.increment({collected_counts: -1}, { where: { id: article_id }, transaction: t })
        }
        
        await t.commit();
        return res.status(200).json({ success: '收藏紀錄刪除成功', payload: { article_id } as ILikeship })
        
    } catch (err) {
        await t.rollback();
        return res.status(500).json({ error: '伺服器錯誤' })
    }
}