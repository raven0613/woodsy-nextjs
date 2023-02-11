// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Sequelize, Model, DataTypes, CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';
import {Op} from "sequelize";
import { Iarticle, Icomment, Iuser, errorResult, successResult } from '../../../../type-config'
import db from '../../../../models/index';
const DB: any = db;
const { Users, Articles, Comments, Hollows, Collections, Likeships } = DB;



export default function handleArticles(req: NextApiRequest, res: NextApiResponse<errorResult | successResult>) {
    console.log('變數')
    console.log(process.env.NEXTAUTH_URL)
    console.log(process.env.NEXT_PUBLIC_BASEURL)
    console.log(process.env.MYSQL_DATABASE)
    console.log(process.env.MYSQL_HOST)
    switch (req.method) {
        case 'GET':
            getArticle(req, res)
            break
        case 'PUT':
            editArticle(req, res)
            break
        case 'DELETE':
            deleteArticle(req, res)
            break
        default:
            res.status(405).end() //Method Not Allowed
            break
    }
}

async function getArticle (req: NextApiRequest, res: NextApiResponse<successResult | errorResult>) {
    const { id } = req.query
    const idNum = Number(id)
    console.log('變數')
    console.log(process.env.NEXTAUTH_URL)
    console.log(process.env.NEXT_PUBLIC_BASEURL)
    console.log(process.env.MYSQL_DATABASE)
    console.log(process.env.MYSQL_HOST)
        const article: Iarticle = await Articles.findByPk(idNum, {
            nest: true,
            include: [
                { model: Users, as: 'User', attributes: ['id', 'name'] }, 
                { model: Hollows, as: 'Hollow', attributes: ['id', 'name'] },
                { model: Users, as: 'CollectedUsers', attributes: ['id', 'name'] },
                { model: Users, as: 'LikedUsers', attributes: ['id', 'name'] }
            ]
        })
        if (!article) return res.status(500).json({ error: '找不到文章' } )
        res.status(200).json({ success: '查詢成功', payload: article })
    try {
    } catch (err) {
        return res.status(500).json({ error: '伺服器錯誤' } )
    }

}

async function editArticle (req: NextApiRequest, res: NextApiResponse<errorResult | successResult>) {
    const { id } = req.query
    const idNum = Number(id)
    const { title, content, hollow_id } = req.body
    const t = await new Sequelize('woodsy_nextjs', 'root', process.env.MYSQL_PASSWORD, {
        host: 'localhost',
        dialect: 'mysql'
    }).transaction();

    try {
        const article = await Articles.findByPk(idNum, { transaction: t })
        if (article === null) res.status(500).json({ error: '找不到樹洞' })

        article.set({ title, content, hollow_id }, { transaction: t })
        await article.save({ transaction: t })
        await t.commit();

        return res.status(200).json({ success: '編輯文章成功', payload: article })
    } catch (err) {
        await t.rollback();
        return res.status(500).json({ error: '伺服器錯誤' } )
    }
}

async function deleteArticle (req: NextApiRequest, res: NextApiResponse<errorResult | successResult>) {
    const { id } = req.query
    const idNum = Number(id)
    const t = await new Sequelize('woodsy_nextjs', 'root', process.env.MYSQL_PASSWORD, {
        host: 'localhost',
        dialect: 'mysql'
    }).transaction();
    try {
        const comments = await Comments.findAll({ where: { article_id: idNum } }, { transaction: t });
        const commentIds = comments.map((c: { id: number }) => c.id);
        
        await Likeships.destroy({
            where: {
                [Op.or]: [
                    { article_id: idNum },
                    { comment_id: { [Op.in]: commentIds } },
                ]
            }
        }, { transaction: t });
        await Collections.destroy({
            where: { article_id: idNum }
        }, { transaction: t })
        await Comments.destroy({
            where: { article_id: idNum }
        }, { transaction: t })

        const article = await Articles.findByPk(idNum, { transaction: t })
        if (!article) return res.status(500).json({ error: '此文章不存在' })

        const hollow = await Hollows.findByPk(article.hollow_id, { transaction: t })
        if (hollow) {
            await hollow.increment({article_counts: -1}, { where: { id: article.hollow_id }, transaction: t })
        }

        await Articles.destroy({ where: { id: idNum } }, { transaction: t })
        await t.commit();

        return res.status(200).json({ success: '刪除文章成功' })
    
    } catch (err) {
        await t.rollback();
        return res.status(500).json({ error: '伺服器錯誤' })
    }
}