// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Sequelize, Model, DataTypes, CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';
import { Iarticle, Icomment, Iuser } from '../../../home'
import db from '../../../../models/index';
const { Users, Articles, Comments } = db;


export default function handleArticles(req: NextApiRequest, res: NextApiResponse<Iarticle | Icomment>) {
    switch (req.method) {
        case 'GET':
            getArticle(req, res)
            break
        case 'POST':
            addArticle(req, res)
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

async function getArticle (req: NextApiRequest, res: NextApiResponse<Iarticle>) {
    const { id } = req.query
    const idNum = Number(id)
    const article: Iarticle = await Articles.findByPk(idNum, {
      raw: true,
      nest: true,
      include: [
        { model: Users, as: 'User' }, 
        { model: Comments, as: 'Comments' }]
    })
    if (article === null) return res.status(405).end({ message: '找不到文章' })
    res.status(200).json(article)
}

async function addArticle (req: NextApiRequest, res: NextApiResponse<Iarticle>) {
    console.log(req)
    res.status(200).json(article)
}

async function editArticle (req: NextApiRequest, res: NextApiResponse<Iarticle>) {
    const { id } = req.query
    const idNum = Number(id)

    const article = await Articles.destroy({
        where: {
            id: idNum
        }
    })
    if (article === null) return res.status(405).end({ message: '找不到文章' })
    console.log('put')

    res.status(200).json(article)
}

async function deleteArticle (req: NextApiRequest, res: NextApiResponse<Iarticle>) {
    const { id } = req.query
    const idNum = Number(id)
    const comment = await Comments.destroy({
        where: {
            articleId: idNum
        }
    })
    if (comment === null) return res.status(405).end({ message: '找不到評論' })
    const article = await Articles.destroy({
        where: {
            id: idNum
        }
    })
    if (article === null) return res.status(405).end({ message: '找不到文章' })

    res.status(200).json(article)
}

const article: Iarticle = {
    id: 1,
    title: '找工作嗚嗚',
    hollowId: 'h1',
    userId: 'u1',
    content: '好想趕快找到工作，過年後就想要找工作懂否',
    comments: 2,
    collectedCounts: 20,
    likedCounts: 50,
    reportedCounts: 1,
    isCollected: false,
    isLiked: false,
    reportedAt: '20230105',
    createdAt: '20230105'
}

