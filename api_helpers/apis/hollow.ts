import { apiHelper } from '../config'
import { Ihollow, Iarticle, Icomment, Iuser, param } from '../../type-config'

export function getHollow (id: string) {
    return apiHelper.get(`hollow/${id}`)
}

export function getHollows (url: string, page: number, limit: number, keyword: string) {
    return apiHelper.get(url, { params: { page, limit, keyword } })
}

export function addHollow (url: string, hollow: Ihollow) {
    return apiHelper.post(url, hollow)
}

export function editHollow () {

}
