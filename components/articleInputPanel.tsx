import { useRouter } from 'next/router'

interface Iarticle {
    id: string,
    name: string,
    userId: string,
    content: string,
    isCollected: boolean,
    isLiked: boolean
}; 


export default function ArticleInputPanel () {

    return (
        <>
            <p>向樹洞說說話</p>
            <input placeholder='請輸入標題' type="text" />
            <textarea name="" id="" cols="30" rows="10"></textarea>
            <p>選擇樹洞</p>
            <input type="text" />
        </>
    )
}