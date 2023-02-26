// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from "next-auth/next"
import { authOptions } from '../auth/[...nextauth]'

import { Sequelize } from 'sequelize';
import { Iarticle, Icomment, Iuser, errorResult, successResult } from '../../../type-config'
import db from '../../../models/index';
const DB: any = db;
const { Users, Articles, Comments, Hollows, Likeships } = DB;

export default async function handleComments(req: NextApiRequest, res: NextApiResponse<successResult | errorResult>) {
    switch (req.method) {
        case 'GET':
            getComment(req, res)
            break
        case 'PUT':
            editComment(req, res)
            break
        case 'DELETE':
            deleteComment(req, res)
            break
        default:
            res.status(405).end() //Method Not Allowed
            break
    }
}

async function getComment (req: NextApiRequest, res: NextApiResponse<successResult | errorResult>) {
    const { id } = req.query
    const idNum = Number(id)
    try {
        const comment: Iarticle = await Comments.findByPk(idNum, {
            nest: true,
            include: [
                { model: Users, as: 'User', attributes: ['id', 'name'] }, 
                { model: Users, as: 'LikedUsers', attributes: ['id', 'name'] },
            ]
        })
        if (!comment) return res.status(500).json({ error: '找不到文章' } )
        res.status(200).json({ success: '查詢成功', payload: comment })
    
    } catch (err) {
        return res.status(500).json({ error: '伺服器錯誤' } )
    }

}

async function editComment (req: NextApiRequest, res: NextApiResponse<successResult | errorResult>) {
    const session = await getServerSession(req, res, authOptions)
    if (!session) return res.status(401).json({ error: '請先登入' })

    const { id } = req.query
    const idNum = Number(id)
    const { content } = req.body
    const t = await new Sequelize(process.env.MYSQL_DATABASE || '', process.env.MYSQL_USER || '', process.env.MYSQL_PASSWORD, {
        host: process.env.MYSQL_HOST,
        dialect: 'mysql'
    }).transaction();

    try {
        const comment = await Comments.findByPk(idNum, { transaction: t })
        if (!comment) return res.status(500).json({ error: '找不到該回覆' })
        if (comment.user_id !== session.user.id) return res.status(401).json({ error: '使用者身分不符' })

        comment.set({ content }, { transaction: t })
        await comment.save({ transaction: t })
        await t.commit();

        res.status(200).json({ success: '編輯回覆成功', payload: comment })
    } catch (err) {
        await t.rollback();
        return res.status(500).json({ error: '伺服器錯誤' })
    }
}

async function deleteComment (req: NextApiRequest, res: NextApiResponse<successResult | errorResult>) {
    const session = await getServerSession(req, res, authOptions)
    if (!session) return res.status(401).json({ error: '請先登入' })

    const { id } = req.query
    const idNum = Number(id)
    const t = await new Sequelize(process.env.MYSQL_DATABASE || '', process.env.MYSQL_USER || '', process.env.MYSQL_PASSWORD, {
        host: process.env.MYSQL_HOST,
        dialect: 'mysql'
    }).transaction();
    try {
        const comment = await Comments.findByPk(idNum, { transaction: t })
        if (!comment) return res.status(500).json({ error: '此回覆不存在' })
        if (comment.user_id !== session.user.id) return res.status(401).json({ error: '使用者身分不符' })
        
        await Likeships.destroy({
            where: { comment_id: idNum }
        }, { transaction: t })

        const article = await Articles.findByPk(comment.article_id, { transaction: t })
        if (article) {
            await Articles.increment({comment_counts: -1}, { where: { id: comment.article_id }, transaction: t })
        }

        await comment.destroy({}, { transaction: t })
        await t.commit();

        return res.status(200).json({ success: '刪除回覆成功', payload: comment.id})
    } catch (err) {
        await t.rollback();
        return res.status(500).json({ error: '伺服器錯誤' })
    }
}



