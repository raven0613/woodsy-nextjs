import { Iarticle, Icomment, Iuser, param, commentArg, articleArg, deleteArg } from '../type-config'
import { getArticles, getArticle, addArticle, editArticle, deleteArticle } from '../api_helpers/apis/article'
import { getComments, addComment, editComment, deleteComment } from '../api_helpers/apis/comments'
import { getHollows, getHollow } from '../api_helpers/apis/hollow'


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

export async function fetchHotArticles (url: string, { page, limit }: param) {
    try {
        const res = await getArticles(url, page, limit)
        return res
    } catch (err) {
        console.log(err)
    }
}

export async function fetchArticle (id: string) {
    try {
        const res = await getArticle(id)
        return res
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

