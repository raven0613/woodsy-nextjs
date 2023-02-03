// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Sequelize, Model, DataTypes, CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';
import { Iarticle, Icomment, Iuser, errorMessage } from '../../../../type-config'
import db from '../../../../models/index';
const DB: any = db;
const { Users, Articles, Comments, Hollows } = DB;

export default function handleArticles(req: NextApiRequest, res: NextApiResponse<Iarticle | Icomment | errorMessage>) {
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

async function getArticle (req: NextApiRequest, res: NextApiResponse<Iarticle | errorMessage>) {
    const { id } = req.query
    const idNum = Number(id)
    try {
        const article: Iarticle = await Articles.findByPk(idNum, {
            raw: true,
            nest: true,
            include: [
                { model: Users, as: 'User', attributes: ['id', 'name'] }, 
                { model: Hollows, as: 'Hollow', attributes: ['id', 'name'] }
            ]
        })
        if (article === null) return res.status(500).json({ error: '找不到文章' } )
        res.status(200).json(article)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: '伺服器錯誤' } )
    }

}

async function editArticle (req: NextApiRequest, res: NextApiResponse<Iarticle | errorMessage>) {
    const { id } = req.query
    const idNum = Number(id)
    const { title, content, hollow_id } = req.body
    try {
        const article = await Articles.findByPk(idNum)
        if (article === null) res.status(500).json({ error: '找不到樹洞' })

        article.set({ title, content, hollow_id })
        await article.save()

        return res.status(200).json(article)
    } catch (err) {
        return res.status(500).json({ error: '伺服器錯誤' } )
    }

}

async function deleteArticle (req: NextApiRequest, res: NextApiResponse<Iarticle | errorMessage>) {
    const { id } = req.query
    const idNum = Number(id)
    const t = await new Sequelize().transaction();
    try {
        await Comments.destroy({
            where: { article_id: idNum }
        }, { transaction: t })

        const article = await Articles.findByPk(idNum, { transaction: t })
        if (article === null) return res.status(500).json({ error: '找不到文章' })
        await article.destroy({}, { transaction: t })

        await t.commit();

        return res.status(200).json(article)
    } catch (err) {
        console.log(err)
        await t.rollback();
        return res.status(500).json({ error: '伺服器錯誤' })
    }
}