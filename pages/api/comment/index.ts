// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Iarticle, Icomment, Iuser } from '../../../type-config'
import { addCom } from '../article/[id]/comments'

export default function addComment(req: NextApiRequest, res: NextApiResponse<Icomment>) {
    if (req.method !== 'POST') return res.status(405).end() //Method Not Allowed
    const comment = req.body
    addCom(comment)
    res.status(200).json(comment)
}