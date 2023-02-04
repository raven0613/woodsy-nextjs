// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Sequelize } from 'sequelize';
import { Ihollow, Icomment, Iuser, ILikeship, errorMessage, successMessage } from '../../../type-config'
import db from '../../../models/index';
const DB: any = db;
const { Users, Articles, Comments, Hollows, Likeships } = DB;

export default function handleLikeship(req: NextApiRequest, res: NextApiResponse<Ihollow | ILikeship | errorMessage | successMessage>) {
    switch (req.method) {
        case 'POST':
            addLikeship(req, res)
            break
        case 'DELETE':
            deleteLikeship(req, res)
            break
        default:
            res.status(405).end() //Method Not Allowed
            break
    }
}

async function addLikeship (req: NextApiRequest, res: NextApiResponse<ILikeship | errorMessage | successMessage>) {
    const { user_id, comment_id, article_id } = req.body
    const t = await new Sequelize('woodsy_nextjs', 'root', process.env.SEQUELIZE_PASSWORD, {
        host: 'localhost',
        dialect: 'mysql'
    }).transaction();

        if (article_id) {
            const existLike = await Likeships.findOne({
                where: {
                    user_id, article_id
                }
            }, { transaction: t })
            if (existLike) return res.status(500).json({ error: '已存在相同紀錄' })

            const sub = await Likeships.create({
                user_id, article_id
            }, { transaction: t })
            if (!sub) return res.status(500).json({ error: '記錄新增失敗' })
            await t.commit();
            return res.status(200).json({ success: '關注成功', payload: sub })
        }
        if (comment_id) {
            const existLike = await Likeships.findOne({
                where: {
                    user_id, comment_id
                }
            }, { transaction: t })
            if (existLike) return res.status(500).json({ error: '已存在相同紀錄' })
            const sub = await Likeships.create({
                user_id, comment_id
            }, { transaction: t })
            if (!sub) return res.status(500).json({ error: '記錄新增失敗' })
            await t.commit();
            return res.status(200).json({ success: '關注成功', payload: sub })
        }
    try {

    } catch (err) {
        await t.rollback();
        return res.status(500).json({ error: '伺服器錯誤' })
    }
}

async function deleteLikeship (req: NextApiRequest, res: NextApiResponse<ILikeship | errorMessage | successMessage>) {
    const { user_id, comment_id, article_id } = req.body
    const t = await new Sequelize('woodsy_nextjs', 'root', process.env.SEQUELIZE_PASSWORD, {
        host: 'localhost',
        dialect: 'mysql'
    }).transaction();

    try {
        if (article_id) {
            const existLike = await Likeships.destroy({
                where: {
                    user_id, article_id
                }
            }, { transaction: t })
            if (!existLike) return res.status(500).json({ error: '此紀錄不存在' })
            
            await t.commit();
            return res.status(200).json({ success: '關注紀錄刪除成功' })
        }
        if (comment_id) {
            const existLike = await Likeships.destroy({
                where: {
                    user_id, comment_id
                }
            }, { transaction: t })
            if (!existLike) return res.status(500).json({ error: '此紀錄不存在' })
            
            await t.commit();
            return res.status(200).json({ success: '關注紀錄刪除成功' })
        }
    } catch (err) {
        await t.rollback();
        return res.status(500).json({ error: '伺服器錯誤' })
    }
}