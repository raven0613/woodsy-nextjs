import { apiHelper } from '../config'
import { Iarticle, Icomment, Iuser, ILoginuser, param, collectionPayload, likePayload, subPayload } from '../../type-config'
import { AxiosResponse } from 'axios'

export function getUsers (url: string, page: number, limit: number) {
    return apiHelper.get(url, { params: { page, limit } })
}

export function getUser (url: string, userId: string) {
    return apiHelper.get(`${url}/${userId}`, {data: userId})
}

export function editUser (url: string, user: Iuser) {
    return apiHelper.put(`${url}/${user.id}`, user)
}

export function blockUser (url: string, userId: string) {
    return apiHelper.patch(`${url}/${userId}`, {data: userId})
}


export function userLogin (url: string, loginUser: ILoginuser) {
    return apiHelper.post(url, loginUser)
}

export function userRegister (url: string, user: Iuser) {
    return apiHelper.post(url, user)
}

export function addUserLike (url: string, payload: likePayload) {
    return apiHelper.post(url, payload)
}

export function addUserCollect (url: string, payload: collectionPayload) {
    return apiHelper.post(url, payload)
}

export function deleteUserLike (url: string, payload: likePayload) {
    return apiHelper.delete(url, {data: payload})
}

export function deleteUserCollect (url: string, payload: collectionPayload) {
    return apiHelper.delete(url, {data: payload})
}

export function addUserSub (url: string, payload: subPayload) {
    return apiHelper.post(url, payload)
}

export function deleteUserSub (url: string, payload: subPayload) {
    return apiHelper.delete(url, {data: payload})
}