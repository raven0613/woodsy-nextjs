// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Ihollow, Icomment, Iuser } from '../../home'

type Data = {
  name: string
}

export default function addUser(
  req: NextApiRequest,
  res: NextApiResponse<Ihollow> ) {
  res.status(200).json(hollow)
}


const hollow: Ihollow = {
    id: 'h1',
    name: '心情',
    type: 'public',
    userId: 'u0',
    article: 10,
    isSub: true,
    subCounts: 100,
    createdAt: '20230105'
}