// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Sequelize } from 'sequelize';
import { Ihollow, Icomment, Iuser, ISubcription, errorMessage, successMessage } from '../../../type-config'
import db from '../../../models/index';
const DB: any = db;
const { Users, Articles, Comments, Hollows, Subscriptions } = DB;

export default function handleSubscriptions(req: NextApiRequest, res: NextApiResponse<Ihollow | ISubcription | errorMessage | successMessage>) {
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

async function addSubscription (req: NextApiRequest, res: NextApiResponse<ISubcription | errorMessage | successMessage>) {
    const { user_id, hollow_id } = req.body
    const t = await new Sequelize('woodsy_nextjs', 'root', process.env.SEQUELIZE_PASSWORD, {
        host: 'localhost',
        dialect: 'mysql'
    }).transaction();

    try {
        const existSub = await Subscriptions.findOne({
            where: {
                user_id, hollow_id
            }
        }, { transaction: t })
        if (existSub) return res.status(500).json({ error: '已存在相同紀錄' })
        const sub = await Subscriptions.create({
            user_id, hollow_id
        }, { transaction: t })
        if (!sub) return res.status(500).json({ error: '關注失敗' })
        await t.commit();
        return res.status(200).json({ success: '關注成功', payload: sub })
    } catch (err) {
        await t.rollback();
        return res.status(500).json({ error: '伺服器錯誤' })
    }
}

async function deleteSubscription (req: NextApiRequest, res: NextApiResponse<ISubcription | errorMessage | successMessage>) {
    const { user_id, hollow_id } = req.body
    const t = await new Sequelize('woodsy_nextjs', 'root', process.env.SEQUELIZE_PASSWORD, {
        host: 'localhost',
        dialect: 'mysql'
    }).transaction();

    try {
        const existSub = await Subscriptions.destroy({
            where: {
                user_id, hollow_id
            }
        }, { transaction: t })
        if (!existSub) return res.status(500).json({ error: '此紀錄不存在' })
        
        await t.commit();
        return res.status(200).json({ success: '關注紀錄刪除成功' })
        
    } catch (err) {
        await t.rollback();
        return res.status(500).json({ error: '伺服器錯誤' })
    }
}