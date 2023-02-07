import { apiHelper } from '../config'
import { Iarticle, Icomment, Iuser, param } from '../../type-config'

export function getArticles (url: string, page: number, limit: number) {
    return apiHelper.get(url, { params: { page, limit } })
}

export function getArticle (url: string) {
    return apiHelper.get(url)
}

export function addArticle (url: string, article: Iarticle) {
    return apiHelper.post(url, article)
}

export function editArticle (url: string, article: Iarticle) {
    return apiHelper.put(`${url}/${article.id}`, article)
}

export function deleteArticle (url: string, articleId: string) {
    return apiHelper.delete(`${url}/${articleId}`, {data: articleId})
}