import { apiHelper } from '../config'
import { Iarticle, Icomment, Iuser, param } from '../../pages/home'
import { AxiosResponse } from 'axios'

export function getComments (url: string, page: number, limit: number) {
    return apiHelper.get(url, { params: { page, limit } })
}

export function addComments (url: string, comment: Icomment) {
    return apiHelper.post(url, comment)
}