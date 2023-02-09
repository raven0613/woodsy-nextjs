// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Ihollow, Icomment, Iuser, errorResult, successResult } from '../../../../type-config'
import db from '../../../../models/index';
const DB: any = db;
const { Users, Articles, Comments, Hollows } = DB;

export default function handleHollows(req: NextApiRequest, res: NextApiResponse<successResult | errorResult>) {
    switch (req.method) {
        case 'GET':
            getHollow(req, res)
            break
        case 'PUT':
            editHollow(req, res)
            break
        default:
            res.status(405).end() //Method Not Allowed
            break
    }
}

async function getHollow (req: NextApiRequest, res: NextApiResponse<successResult | errorResult>) {
    const { id } = req.query
    const idNum = Number(id)
    try {
        const hollow = await Hollows.findByPk(idNum, {
            include: [
                { model: Users, attributes: ['id', 'name'] },
                { model: Users, as: 'SubUsers', attributes: ['id', 'name']},
            ],
            nest: true
        })

        if (!hollow) return res.status(500).json({ error: '找不到樹洞' } )
        res.status(200).json({ success: '查詢成功', payload: hollow })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: '伺服器錯誤' } )
    }
}

async function editHollow (req: NextApiRequest, res: NextApiResponse<successResult | errorResult>) {
    const { id } = req.query
    const { name, type } = req.body
    try {
        const hollow = await Hollows.findByPk(id, {
            include: [
                { model: Users, attributes: ['id', 'name'] }],
            nest: true
        })
        if (hollow === null) return res.status(500).json({ error: '找不到樹洞'})

        hollow.set({ name, type })
        await hollow.save()
        res.status(200).json({ success: '樹洞編輯成功', payload: hollow })
    } catch (err) {
        return res.status(500).json({ error: '伺服器錯誤' })
    }
}