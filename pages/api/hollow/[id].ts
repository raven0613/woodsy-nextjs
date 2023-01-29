// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Ihollow, Icomment, Iuser } from '../../../type-config'


export default function handleHollows(req: NextApiRequest, res: NextApiResponse<Ihollow>) {
    switch (req.method) {
        case 'GET':
            getHollow(res)
            break
        case 'POST':
            addHollow(res)
            break
        case 'PUT':
            editHollow(res)
            break
        default:
            res.status(405).end() //Method Not Allowed
            break
    }
}


async function getHollow (res: NextApiResponse<Ihollow>) {
    console.log('get')
    res.status(200).json(hollow)
}

async function addHollow (res: NextApiResponse<Ihollow>) {
    console.log('post')
    res.status(200).json(hollow)
}

async function editHollow (res: NextApiResponse<Ihollow>) {
    console.log('put')
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