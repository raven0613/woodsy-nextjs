import { apiHelper } from '../config'
import { Iarticle, Icomment, Iuser, param } from '../../type-config'
import { AxiosResponse } from 'axios'

export function getComments (url: string, page: number, limit: number) {
    return apiHelper.get(url, { params: { page, limit } })
}

export function addComment (url: string, comment: Icomment) {
    return apiHelper.post(url, comment)
}

export function editComment (url: string, comment: Icomment) {
    return apiHelper.put(`${url}/${comment.id}`, comment)
}

export function deleteComment (url: string, commentId: string) {
    return apiHelper.delete(`${url}/${commentId}`, {data: commentId})
}