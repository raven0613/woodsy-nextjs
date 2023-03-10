// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from "next-auth/next"
import { authOptions } from '../auth/[...nextauth]'

import { Sequelize } from 'sequelize';
import { Ihollow, Icomment, Iuser, ISubcription, errorResult, successResult } from '../../../type-config'
import db from '../../../models/index';
// const DB: any = db;
const { Users, Articles, Comments, Hollows, Subscriptions } = db;

export default async function handleSubscriptions(req: NextApiRequest, res: NextApiResponse<errorResult | successResult>) {
    switch (req.method) {
        case 'POST':
            addSubscription(req, res)
            break
        case 'DELETE':
            deleteSubscription(req, res)
            break
        default:
            res.status(405).end() //Method Not Allowed
            break
    }
}

async function addSubscription (req: NextApiRequest, res: NextApiResponse<errorResult | successResult>) {
    const session = await getServerSession(req, res, authOptions)
    if (!session) return res.status(401).json({ error: '請先登入' })

    const { user_id, hollow_id } = req.body
    if (user_id !== session.user.id) return res.status(401).json({ error: '使用者身分不符' })
    if (!user_id || !hollow_id) return res.status(400).json({ error: '請確認請求資料' })

    const t = await new Sequelize(process.env.MYSQL_DATABASE || '', process.env.MYSQL_USER || '', process.env.MYSQL_PASSWORD, {
        host: process.env.MYSQL_HOST,
        dialect: 'mysql'
    }).transaction();

    try {
        const existSub = await Subscriptions.findOne({
            where: {
                user_id, hollow_id
            },
            transaction: t
        })
        if (existSub) return res.status(409).json({ error: '已存在相同紀錄' })

        const sub = await Subscriptions.create({
            user_id, hollow_id
        }, { transaction: t })
        if (!sub) return res.status(500).json({ error: '記錄新增失敗' })

        const hollow = await Hollows.findByPk(hollow_id, { transaction: t })
        if (hollow) {
            await Hollows.increment({sub_counts: 1}, {where: { id: hollow_id }, transaction: t})
        }

        await t.commit();
        return res.status(200).json({ success: '關注成功', payload: JSON.parse(JSON.stringify(sub)) })

    } catch (err) {
        await t.rollback();
        return res.status(500).json({ error: '伺服器錯誤' })
    }
}

async function deleteSubscription (req: NextApiRequest, res: NextApiResponse<errorResult | successResult>) {
    const session = await getServerSession(req, res, authOptions)
    if (!session) return res.status(401).json({ error: '請先登入' })

    const { user_id, hollow_id } = req.body
    if (user_id !== session.user.id) return res.status(401).json({ error: '使用者身分不符' })
    if (!user_id || !hollow_id) return res.status(400).json({ error: '請確認請求資料' })

    const t = await new Sequelize(process.env.MYSQL_DATABASE || '', process.env.MYSQL_USER || '', process.env.MYSQL_PASSWORD, {
        host: process.env.MYSQL_HOST,
        dialect: 'mysql'
    }).transaction();

    try {
        const existSub = await Subscriptions.destroy({
            where: {
                user_id, hollow_id
            },
            transaction: t
        })
        if (!existSub) return res.status(404).json({ error: '此紀錄不存在' })

        const hollow = await Hollows.findByPk(hollow_id, { transaction: t })
        if (hollow) {
            await Hollows.increment({sub_counts: -1}, { where: { id: hollow_id }, transaction: t })
        }

        await t.commit();
        return res.status(200).json({ success: '關注紀錄刪除成功' })
        
    } catch (err) {
        await t.rollback();
        return res.status(500).json({ error: '伺服器錯誤' })
    }
}