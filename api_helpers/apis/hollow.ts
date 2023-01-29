import { apiHelper } from '../config'
import { Iarticle, Icomment, Iuser, param } from '../../type-config'

export function getHollow (id: string) {
    return apiHelper.get(`hollow/${id}`)
}

export function getHollows (url: string, page: number, limit: number) {
    return apiHelper.get(url, { params: { page, limit } })
}

export function addHollow () {
    
}

export function editHollow () {

}
