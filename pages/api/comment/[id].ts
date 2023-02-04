// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Sequelize } from 'sequelize';
import { Iarticle, Icomment, Iuser, errorMessage } from '../../../type-config'
import db from '../../../models/index';
const DB: any = db;
const { Users, Articles, Comments, Hollows } = DB;

export default function handleComments(req: NextApiRequest, res: NextApiResponse<Icomment | errorMessage>) {
    switch (req.method) {
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

async function editComment (req: NextApiRequest, res: NextApiResponse<Icomment | errorMessage>) {
    const { id } = req.query
    const idNum = Number(id)
    const { content } = req.body
    const t = await new Sequelize('woodsy_nextjs', 'root', process.env.SEQUELIZE_PASSWORD, {
        host: 'localhost',
        dialect: 'mysql'
    }).transaction();

    try {
        const comment = await Comments.findByPk(idNum, { transaction: t })
        if (!comment) return res.status(500).json({ error: '找不到該回覆' })

        comment.set({ content }, { transaction: t })
        await comment.save({ transaction: t })
        await t.commit();

        
        res.status(200).json(comment)
    } catch (err) {
        await t.rollback();
        return res.status(500).json({ error: '伺服器錯誤' })
    }
}

async function deleteComment (req: NextApiRequest, res: NextApiResponse<Icomment | errorMessage>) {
    const { id } = req.query
    const idNum = Number(id)
    const t = await new Sequelize('woodsy_nextjs', 'root', process.env.SEQUELIZE_PASSWORD, {
        host: 'localhost',
        dialect: 'mysql'
    }).transaction();
    try {
        const comment = await Comments.findByPk(idNum, { transaction: t })
        if (!comment) return res.status(500).json({ error: '此回覆不存在' })

        // 先把 article 的 comment_counts - 1
        const article = await Articles.findByPk(comment.article_id, { transaction: t })
        if (article) {
            await article.set({ comment_counts: article.comment_counts - 1 }, { transaction: t })
            await article.save({ transaction: t })
        }
        //TODO: 還要把 user 的 count -1

        await comment.destroy({}, { transaction: t })
        await t.commit();

        return res.status(200).json(comment)
    } catch (err) {
        await t.rollback();
        return res.status(500).json({ error: '伺服器錯誤' })
    }
}



