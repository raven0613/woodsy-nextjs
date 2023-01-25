import { apiHelper } from '../config'

export function getArticles (url: string, page: number, limit: number) {
    return apiHelper.get(url, { params: { page, limit } })
}

export function getArticle (id: string) {
    return apiHelper.get(`article/${id}`)
}