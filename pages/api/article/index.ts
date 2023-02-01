// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
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


export async function getArticles(req: NextApiRequest, res: NextApiResponse<Iarticle[]>) {
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
    if (articles === null) return res.status(405).end()
    res.status(200).json(articles)  //回傳的是 count 和 data
  } catch (err) {
    res.status(405).end()
  }
}

async function addArticle (req: NextApiRequest, res: NextApiResponse<Iarticle | errorMessage>) {
  try {
    const { title, hollowId: hollow_id, content, userId: user_id } = req.body
    
    if (!title || title.length < 2 || title.length >= 20) {
      return res.status(500).json({ error: '標題字數不足' })
    }
    if (!content || content.length < 2 || content.length >= 800) {
      return res.status(500).json({ error: '標題字數不足' })
    }

    const article: Iarticle = await Articles.create({
      title, 
      content, 
      comment_counts: 0, 
      collected_counts: 0, 
      liked_counts: 0, 
      reported_counts: 0,
      hollow_id, 
      user_id: 6, 
    })

    console.log('加上去 ' + article)
    res.status(200).json(article)
  } catch (err) {
    res.status(405).end()
  }
}