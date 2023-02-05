// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Sequelize } from 'sequelize';
import { Ihollow, Icomment, Iuser, ILikeship, errorResult, successResult } from '../../../type-config'
import db from '../../../models/index';
const DB: any = db;
const { Users, Articles, Comments, Hollows, Likeships } = DB;

export default function handleLikeship(req: NextApiRequest, res: NextApiResponse<errorResult | successResult>) {
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

async function addLikeship (req: NextApiRequest, res: NextApiResponse<errorResult | successResult>) {
    const { user_id, comment_id, article_id } = req.body
    console.log(req.body)
    const t = await new Sequelize('woodsy_nextjs', 'root', process.env.SEQUELIZE_PASSWORD, {
        host: 'localhost',
        dialect: 'mysql'
    }).transaction();

    try {
        let existLike, like
        if (article_id) {
            existLike = await Likeships.findOne({
                where: {
                    user_id, article_id
                }
            }, { transaction: t })
            if (existLike) return res.status(403).json({ error: '已存在相同紀錄' })

            like = await Likeships.create({
                user_id, article_id
            }, { transaction: t })
            if (!like) return res.status(500).json({ error: '記錄新增失敗' })

            const article = await Articles.findByPk(article_id, { transaction: t })
            if (article) {
                await Articles.increment({liked_counts: 1}, { where: { id: article_id }, transaction: t })
            }
        }
        if (comment_id) {
            existLike = await Likeships.findOne({
                where: {
                    user_id, comment_id
                }
            }, { transaction: t })
            if (existLike) return res.status(403).json({ error: '已存在相同紀錄' })

            like = await Likeships.create({
                user_id, comment_id
            }, { transaction: t })
            if (!like) return res.status(500).json({ error: '記錄新增失敗' })

            const comment = await Comments.findByPk(comment_id, { transaction: t })
            if (comment) {
                await Hollows.increment({liked_counts: 1}, { where: { id: comment_id }, transaction: t })
            }
        }
        await t.commit();
        return res.status(200).json({ success: '喜歡成功', payload: like })
    } catch (err) {
        await t.rollback();
        return res.status(500).json({ error: '伺服器錯誤' })
    }
}

async function deleteLikeship (req: NextApiRequest, res: NextApiResponse<errorResult | successResult>) {
    const { user_id, comment_id, article_id } = req.body
    const t = await new Sequelize('woodsy_nextjs', 'root', process.env.SEQUELIZE_PASSWORD, {
        host: 'localhost',
        dialect: 'mysql'
    }).transaction();

    try {
        let existLike
        if (article_id) {
            existLike = await Likeships.destroy({
                where: {
                    user_id, article_id
                }
            }, { transaction: t })
            if (!existLike) return res.status(500).json({ error: '此紀錄不存在' })

            const article = await Articles.findByPk(article_id, { transaction: t })
            if (article) {
                await Articles.increment({liked_counts: -1}, { where: { id: article_id }, transaction: t })
            }
        }
        if (comment_id) {
            existLike = await Likeships.destroy({
                where: {
                    user_id, comment_id
                }
            }, { transaction: t })
            if (!existLike) return res.status(500).json({ error: '此紀錄不存在' })

            const comment = await Comments.findByPk(comment_id, { transaction: t })
            if (comment) {
                await Hollows.increment({liked_counts: -1}, { where: { id: comment_id }, transaction: t })
            }
        }
        await t.commit();
        return res.status(200).json({ success: '關注紀錄刪除成功' })
    } catch (err) {
        await t.rollback();
        return res.status(500).json({ error: '伺服器錯誤' })
    }
}