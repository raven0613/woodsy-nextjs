import { apiHelper } from '../config'

export function getComments (url: string, page: number, limit: number) {
    return apiHelper.get(url, { params: { page, limit } })
}