// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Sequelize } from 'sequelize';
import { Iarticle, Icomment, Iuser, errorResult, successResult } from '../../../type-config'

import db from '../../../models/index';
const DB: any = db;
const { Users, Articles, Comments, Hollows, Collections, Likeships } = DB;


function getOffset (page: number, limit: number) {
  return (page - 1) * limit
}

export default function handleArticles(req: NextApiRequest, res: NextApiResponse<successResult | errorResult>) {
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

export async function getArticles(req: NextApiRequest, res: NextApiResponse<successResult | errorResult>) {
  const { page: p, limit: l } = req.query;
  const page = Number(p), limit = Number(l)
  console.log('req.query', req.query)
  try {
    const articles = await Articles.findAndCountAll({
      include: [
        { model: Users, attributes: ['id', 'name'] }, 
        { model: Hollows, attributes: ['id', 'name'] },
        { model: Comments, attributes: ['id', 'content']},
        { model: Users, as: 'CollectedUsers', attributes: ['id', 'name'] },
        { model: Users, as: 'LikedUsers', attributes: ['id', 'name'] }
      ],
      limit,
      offset: getOffset(page, limit),
      nest: true, 
    })

    res.status(200).json({ success: '查詢成功', payload: articles })  //回傳的是 count 和 data
  } catch (err) {
    return res.status(500).json({ error: '伺服器錯誤' })
  }
}

async function addArticle (req: NextApiRequest, res: NextApiResponse<successResult | errorResult>) {
  const { title, hollow_id, content, user_id } = req.body
  const t = await new Sequelize(process.env.MYSQL_DATABASE || '', process.env.MYSQL_USER || '', process.env.MYSQL_PASSWORD, {
      host: process.env.MYSQL_HOST,
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
      hollow_id, 
      user_id, 
    }, { transaction: t })
    if (!article) return res.status(500).json({ error: '新增文章失敗' })

    const hollow = await Hollows.findByPk(hollow_id, { transaction: t })
    if (hollow) {
      await Hollows.increment({article_counts: 1}, { where: { id: hollow_id }, transaction: t })
    }

    // 直接取得完整一包 article 資料回傳
    const resultArticle = await Articles.findByPk(article.id, {
      nest: true,
      include: [
        { model: Users, as: 'User', attributes: ['id', 'name'] }, 
        { model: Hollows, as: 'Hollow', attributes: ['id', 'name'] },
        { model: Users, as: 'CollectedUsers', attributes: ['id', 'name'] },
        { model: Users, as: 'LikedUsers', attributes: ['id', 'name'] }
      ],
      transaction: t
    })
    if (!resultArticle) return res.status(500).json({ error: '找不到文章' } )

    await t.commit();
    res.status(200).json({ success: '新增文章成功', payload: resultArticle })
    
  } catch (err) {
    await t.rollback();
    return res.status(500).json({ error: '伺服器錯誤' })
  }
}