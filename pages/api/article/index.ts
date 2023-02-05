// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Sequelize } from 'sequelize';
import { Iarticle, Icomment, Iuser, errorMessage, successMessage } from '../../../type-config'

import db from '../../../models/index';
const DB: any = db;
const { Users, Articles, Comments, Hollows } = DB;


function getOffset (page: number, limit: number) {
  return (page - 1) * limit
}

export default function handleArticles(req: NextApiRequest, res: NextApiResponse<successMessage | errorMessage>) {
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

export async function getArticles(req: NextApiRequest, res: NextApiResponse<successMessage | errorMessage>) {
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
    })
    res.status(200).json({ success: '查詢成功', payload: articles })  //回傳的是 count 和 data
  } catch (err) {
    return res.status(500).json({ error: '伺服器錯誤' })
  }
}

async function addArticle (req: NextApiRequest, res: NextApiResponse<successMessage | errorMessage>) {
  const { title, hollow_id, content, user_id } = req.body
  const t = await new Sequelize('woodsy_nextjs', 'root', process.env.SEQUELIZE_PASSWORD, {
      host: 'localhost',
      dialect: 'mysql'
  }).transaction();
  try {
    if (!title || title.length < 2 || title.length >= 20) {
      return res.status(500).json({ error: '請確認標題字數' })
    }
    if (!content || content.length < 2 || content.length >= 800) {
      return res.status(500).json({ error: '請確認內容字數' })
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

    await Hollows.increment({article_counts: 1}, { where: { id: hollow_id }, transaction: t })

    await t.commit();
    res.status(200).json({ success: '新增文章成功', payload: article })
  } catch (err) {
    await t.rollback();
    return res.status(500).json({ error: '伺服器錯誤' })
  }
}