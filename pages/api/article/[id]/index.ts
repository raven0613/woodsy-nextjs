// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Iarticle, Icomment, Iuser } from '../../../home'

export default function handleArticles(req: NextApiRequest, res: NextApiResponse<Iarticle | Icomment>) {
    switch (req.method) {
        case 'GET':
            getArticle(res)
            break
        case 'POST':
            addArticle(res)
            break
        case 'PUT':
            editArticle(res)
            break
        case 'DELETE':
            deleteArticle(res)
            break
        default:
            res.status(405).end() //Method Not Allowed
            break
    }
}

function getArticle (res: NextApiResponse<Iarticle>) {
    console.log('get')
    res.status(200).json(article)
}

function addArticle (res: NextApiResponse<Iarticle>) {
    console.log('post')
    res.status(200).json(article)
}

function editArticle (res: NextApiResponse<Iarticle>) {
    console.log('put')
    res.status(200).json(article)
}

function deleteArticle (res: NextApiResponse<Iarticle>) {
    console.log('delete')
    res.status(200).json(article)
}

const article: Iarticle = {
    id: 'a1',
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

