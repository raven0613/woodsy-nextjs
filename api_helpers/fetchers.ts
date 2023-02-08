import { Iarticle, Icomment, Iuser, param, paramArg, commentArg, articleArg, deleteArg, likePayload, collectionPayload, payloadArg } from '../type-config'
import { addUserLike, deleteUserLike, addUserCollect, deleteUserCollect } from '../api_helpers/apis/user'
import { getArticles, getArticle, addArticle, editArticle, deleteArticle } from '../api_helpers/apis/article'
import { getComments, addComment, editComment, deleteComment } from '../api_helpers/apis/comments'
import { getHollows, getHollow } from '../api_helpers/apis/hollow'
import { getUser } from '../api_helpers/apis/user'

export async function fetchUser (url: string, id: string) {
    try {
        const res = await getUser(url, id)
        return res
    } catch (err) {
        console.log(err)
    }
}

export async function fetchUserLike (url: string, { arg }: payloadArg) {
    try {
        const { data } = await addUserLike(url, arg)
        return data
    } catch (err) {
        console.log(err)
    }
}

export async function fetchDeleteUserLike (url: string, { arg }: payloadArg) {
    try {
        const { data } = await deleteUserLike(url, arg)
        return data
    } catch (err) {
        console.log(err)
    }
}

export async function fetchUserCollect (url: string, { arg }: payloadArg) {
    try {
        const { data } = await addUserCollect(url, arg as collectionPayload)
        return data
    } catch (err) {
        console.log(err)
    }
}

export async function fetchDeleteUserCollect (url: string, { arg }: payloadArg) {
    try {
        const { data } = await deleteUserCollect(url, arg as collectionPayload)
        return data
    } catch (err) {
        console.log(err)
    }
}

export async function fetchHollow (id: string) {
    try {
        const res = await getHollow(id)
        return res
    } catch (err) {
        console.log(err)
    }
}

export async function fetchHotHollows (url: string, { page, limit }: param) {
    try {
        const res = await getHollows(url, page, limit)
        return res
    } catch (err) {
        console.log(err)
    }
}

export async function fetchHotArticles (url: string, { arg }: paramArg) {
    const { page, limit } = arg
    try {
        const { data } = await getArticles(url, page, limit)
        return data
    } catch (err) {
        console.log(err)
    }
}

export async function fetchArticle (url: string) {
    try {
        const { data } = await getArticle(url)
        return data
    } catch (err) {
        console.log(err)
    }
}

export async function fetchAddArt (url: string, { arg }: articleArg) {
    try {
        const { data } = await addArticle(url, arg)
        return data
    } catch (err) {
        console.log(err)
    }
}

export async function fetchEditArticle (url: string, { arg }: articleArg) {
    try {
        const { data } = await editArticle(url, arg)
        return data
    } catch (err) {
        console.log(err)
    }
}

export async function fetchDeleteArticle (url: string, { arg }: deleteArg) {
    try {
        const { data } = await deleteArticle(url, arg)
        return data
    } catch (err) {
        console.log(err)
    }
}

export async function fetchComments (url: string, { page, limit }: param) {
    try {
        const res = await getComments(url, page, limit)
        return res
    } catch (err) {
        console.log(err)
    }
}



export async function fetchAddComments (url: string, { arg }: commentArg) {
    try {
        const { data } = await addComment(url, arg)
        return data
    } catch (err) {
        console.log(err)
    }
}

export async function fetchEditComments (url: string, { arg }: commentArg) {
    try {
        const { data } = await editComment(url, arg)
        return data
    } catch (err) {
        console.log(err)
    }
}

export async function fetchDeleteComments (url: string, { arg }: deleteArg) {
    try {
        const { data } = await deleteComment(url, arg)
        return data
    } catch (err) {
        console.log(err)
    }
}

