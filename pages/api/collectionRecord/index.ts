// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Sequelize } from 'sequelize';
import { Ihollow, Icomment, Iuser, ICollection, errorResult, successResult, ILikeship } from '../../../type-config'
import db from '../../../models/index';
const DB: any = db;
const { Users, Articles, Comments, Hollows, Collections } = DB;

export default function handleLikeship(req: NextApiRequest, res: NextApiResponse<errorResult | successResult>) {
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
    const { user_id, article_id } = req.body
    const t = await new Sequelize('woodsy_nextjs', 'root', process.env.SEQUELIZE_PASSWORD, {
        host: 'localhost',
        dialect: 'mysql'
    }).transaction();
    if (!user_id || !article_id) return res.status(500).json({ error: '請確認請求資料' })

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
    const { user_id, article_id } = req.body
    const t = await new Sequelize('woodsy_nextjs', 'root', process.env.SEQUELIZE_PASSWORD, {
        host: 'localhost',
        dialect: 'mysql'
    }).transaction();

    try {
        const existCollection = await Collections.destroy({
            where: {
                user_id, article_id
            }
        }, { transaction: t })
        if (!existCollection) return res.status(500).json({ error: '此紀錄不存在' })
        
        const article = await Articles.findByPk(article_id, { transaction: t })
        if (article) {
            await Articles.increment({collected_counts: -1}, { where: { id: article_id }, transaction: t })
        }
        
        await t.commit();
        return res.status(200).json({ success: '關注紀錄刪除成功', payload: { article_id } as ILikeship })
        
    } catch (err) {
        await t.rollback();
        return res.status(500).json({ error: '伺服器錯誤' })
    }
}