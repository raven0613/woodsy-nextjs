// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { errorResult, successResult } from '../../type-config'



export default function handleTest(req: NextApiRequest, res: NextApiResponse<successResult | errorResult>) {
    return res.status(200).json({ success: '測試連接成功' })
}