// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Ihollow, Icomment, Iuser, errorResult, successResult } from '../../type-config'
import db from '../../models/index';
const DB: any = db;
const { Users, Articles, Comments, Hollows } = DB;
import { getServerSession } from "next-auth/next"
import { authOptions } from './auth/[...nextauth]'


export default async function getCurrentUser(req: NextApiRequest, res: NextApiResponse<successResult | errorResult>) {
    try {
        const session = await getServerSession(req, res, authOptions)

        if (!session) return res.status(401).json({ error: '請先登入' })

        const user = await Users.findByPk(session.user.id, {
            attributes: ['id', 'name', 'email', 'birthday', 'role', 'createdAt', 'updatedAt'],
            raw: true,
            nest: true
        })
        if (!user) return res.status(500).json({ error: '找不到使用者' })
        const articleCounts = await Articles.count({
            where: { user_id: session.user.id }
        })
        const userResult = { ...user, articleCounts: articleCounts? articleCounts : 0 }

        res.status(200).json({ success: '查詢成功', payload: userResult })
    
    } catch (err) {
        return res.status(500).json({ error: '伺服器錯誤' })
    }
}