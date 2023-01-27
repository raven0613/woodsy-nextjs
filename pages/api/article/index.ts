// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Iarticle, Icomment, Iuser } from '../../home'


export default function getArticles(req: NextApiRequest, res: NextApiResponse<Iarticle[]>) {
    const { page, limit } = req.query;
    console.log('page: '+ page + ' limit: ' + limit)
    res.status(200).json(articles)
}


const articles: Iarticle[] = [
  {
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
  },
  {
    id: 2,
    title: '好好玩喔',
    hollowId: 'h7',
    userId: 'u1',
    content: '寶可夢好好玩朱紫真香難道我是真香玩家嗎',
    comments: 18,
    collectedCounts: 2,
    likedCounts: 100,
    reportedCounts: 0,
    isCollected: false,
    isLiked: false,
    reportedAt: '20230105',
    createdAt: '20230105'
  },
  {
    id: 3,
    title: '本多終勝',
    hollowId: 'h3',
    userId: 'u1',
    content: '現在買台積電還來得及嗎?',
    comments: 8,
    collectedCounts: 0,
    likedCounts: 20,
    reportedCounts: 5,
    isCollected: false,
    isLiked: false,
    reportedAt: '20230105',
    createdAt: '20230105'
  },
  {
    id: 4,
    title: '求牧師配點',
    hollowId: 'h6',
    userId: 'u1',
    content: '我想玩牧師可以請各位大大幫我配點嗎?',
    comments: 16,
    collectedCounts: 1,
    likedCounts: 3,
    reportedCounts: 27,
    isCollected: false,
    isLiked: false,
    reportedAt: '20230105',
    createdAt: '20230105'
  },
]