// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Iarticle, Icomment, Iuser } from '../../../type-config'
import { currentUser } from '../user/index'

import db from '../../../models/index';
// const { Users, Articles, Comments, Hollows } = db;
// db.sequelize.sync();
const Users = db.Users;
const Articles = db.Articles;
const Comments = db.Comments;
const Hollows = db.Hollows;

function getOffset (page: number, limit: number) {
  return (page - 1) * limit
}

export default function handleArticles(req: NextApiRequest, res: NextApiResponse<Iarticle[] | Iarticle>) {
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

async function addArticle (req: NextApiRequest, res: NextApiResponse<Iarticle>) {
  try {
    const { title, hollowId: hollow_id, content, userId } = req.body
    console.log('req.body')
    console.log(userId)
    const article: Iarticle = await Articles.create({
      title, 
      content, 
      comment_counts: 0, 
      collected_counts: 0, 
      liked_counts: 0, 
      reported_counts: 0,
      hollow_id: 1, 
      user_id: 1, 
    })

    console.log('加上去 ' + article)
    res.status(200).json(article)
  } catch (err) {
    res.status(405).end()
    console.log(err)
  }
}