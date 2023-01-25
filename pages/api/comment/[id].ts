// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Iarticle, Icomment, Iuser } from '../../home'
import { delCom, editCom } from '../article/[id]/comments'

export default function handleComments(req: NextApiRequest, res: NextApiResponse<Icomment | string>) {
    
    const comment = req.body

    switch (req.method) {
        case 'PUT':
            editComment(comment, res)
            break
        case 'DELETE':
            deleteComment(comment, res)
            break
        default:
            res.status(405).end() //Method Not Allowed
            break
    }
}

function editComment (comment: Icomment, res: NextApiResponse<Icomment>) {
    editCom(comment)
    res.status(200).json(comment)
}

function deleteComment (commentId: string, res: NextApiResponse<string>) {
    delCom(commentId)
    res.status(200).json(commentId)
}



