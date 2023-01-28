// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Ihollow, Icomment, Iuser } from '../../home'
import db from '../../../models/index';
const { Users, Articles, Comments, Hollows } = db;

function getOffset (page: number, limit: number) {
  return (page - 1) * limit
}

export default async function getHollows(req: NextApiRequest, res: NextApiResponse<Ihollow[]>) {
    const { page: p, limit: l } = req.query;
    const page = Number(p), limit = Number(l)
    console.log('page: '+ page + ' limit: ' + limit)

    const hollows = await Hollows.findAndCountAll({
      include: [
        { model: Users, attributes: ['id', 'name'] }],
      limit,
      offset: getOffset(page, limit),
      nest: true, 
    })
    
    if (hollows === null) return res.status(405).end({ message: '找不到樹洞' })
    res.status(200).json(hollows)  //回傳的是 count 和 data
}

const hollows: Ihollow[] = [
  {
    id: 'h1',
    name: '心情',
    type: 'public',
    userId: 'u0',
    article: 10,
    isSub: true,
    subCounts: 100,
    createdAt: '20230105'
  },
  {
    id: 'h2',
    name: '八點檔',
    type: 'public',
    userId: 'u0',
    article: 5,
    isSub: false,
    subCounts: 500,
    createdAt: '20230105'
  },
  {
    id: 'h3',
    name: '股票',
    type: 'public',
    userId: 'u0',
    article: 5,
    isSub: false,
    subCounts: 35,
    createdAt: '20230105'
  },
  {
    id: 'h4',
    name: '寵物',
    type: 'public',
    userId: 'u0',
    article: 16,
    isSub: false,
    subCounts: 600,
    createdAt: '20230105'
  },
  {
    id: 'h5',
    name: '遊戲',
    type: 'public',
    userId: 'u0',
    article: 8,
    isSub: true,
    subCounts: 1000,
    createdAt: '20230105'
  },
  {
    id: 'h6',
    name: '仙境傳說',
    type: 'public',
    userId: 'u0',
    article: 8,
    isSub: true,
    subCounts: 250,
    createdAt: '20230105'
  },
  {
    id: 'h7',
    name: '寶可夢',
    type: 'public',
    userId: 'u0',
    article: 30,
    isSub: true,
    subCounts: 800,
    createdAt: '20230105'
  },
]