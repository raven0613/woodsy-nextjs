// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Sequelize } from 'sequelize';
import { Iarticle, Icomment, Iuser, errorMessage } from '../../../type-config'
import { currentUser } from '../user/index'

import db from '../../../models/index';
const DB: any = db;
const { Users, Articles, Comments, Hollows } = DB;


function getOffset (page: number, limit: number) {
  return (page - 1) * limit
}

export default function handleArticles(req: NextApiRequest, res: NextApiResponse<Iarticle[] | Iarticle | errorMessage>) {
    switch (req.method) {
        case 'GET':
            getArticles(req, res)
            break
        case 'POST':
            addArticle(req, res)
            break
        default:
            res.status(405).end() //Method Not Allowed
            break
    }
}


export async function getArticles(req: NextApiRequest, res: NextApiResponse<Iarticle[] | errorMessage>) {
  try {
    const { page: p, limit: l } = req.query;
    const page = Number(p), limit = Number(l)

    const articles = await Articles.findAndCountAll({
      include: [
        { model: Users, attributes: ['id', 'name'] }, 
        { model: Comments, attributes: ['id', 'content'] }],
      limit,
      offset: getOffset(page, limit),
      nest: true, 
    }) as unknown as Iarticle[]  //TODO: 待刪
    if (articles === null) return res.status(500).json({ error: '找不到文章' })
    res.status(200).json(articles)  //回傳的是 count 和 data
  } catch (err) {
    res.status(405).end()
  }
}

async function addArticle (req: NextApiRequest, res: NextApiResponse<Iarticle | errorMessage>) {
  const { title, hollow_id, content, user_id } = req.body
  const t = await new Sequelize('woodsy_nextjs', 'root', process.env.SEQUELIZE_PASSWORD, {
      host: 'localhost',
      dialect: 'mysql'
  }).transaction();
  try {
    if (!title || title.length < 2 || title.length >= 20) {
      return res.status(500).json({ error: '標題字數不足' })
    }
    if (!content || content.length < 2 || content.length >= 800) {
      return res.status(500).json({ error: '內容字數不足' })
    }


    const article: Iarticle = await Articles.create({
      title, 
      content, 
      comment_counts: 0, 
      collected_counts: 0, 
      liked_counts: 0, 
      reported_counts: 0,
      hollow_id, 
      user_id, 
    }, { transaction: t })
    //TODO: 把 user 的欄位也要加上 articleCounts
    // const user = await Users.findByPk(user_id)
    // user.set({ articleCounts: user.articleCounts? user.articleCounts + 1 : 1 })
    // await user.save()

    const hollow = await Hollows.findByPk(hollow_id, { transaction: t })

    hollow.set({ articleCounts: hollow.articleCounts? hollow.articleCounts + 1 : 1 }, { transaction: t })
    await hollow.save({ transaction: t })

    await t.commit();
    res.status(200).json(article)
  } catch (err) {
    await t.rollback();
    return res.status(500).json({ error: '伺服器錯誤' })
  }
}