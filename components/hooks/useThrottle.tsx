import useSWRMutation, { SWRMutationConfiguration } from 'swr/mutation'
import { successResult, likePayload, collectionPayload } from '../../type-config';
import { fetchUserLike, fetchDeleteUserLike, fetchUserCollect, fetchDeleteUserCollect } from '../../api_helpers/fetchers'
import { Key } from 'swr';
import { Dispatch, SetStateAction, useEffect } from 'react';

interface props {
    hotArtTrigger: (extraArgument?: any, options?: SWRMutationConfiguration<successResult, Error, any, Key> | undefined) => Promise<successResult | undefined>
    page: number
    setPage: Dispatch<SetStateAction<number>>
    artSize: number
    total: number
}

export default function useThrottle({ hotArtTrigger, page, setPage, artSize, total }: props) {
    // 節流
    useEffect(() => {
        let ishandling = false
        function handleScroll () {
            if (ishandling) return
            ishandling = true

            const { clientHeight, scrollTop, scrollHeight } = document.documentElement
            if ((clientHeight + scrollTop) / scrollHeight >= 0.9) {
                if (artSize < total) {
                    const arg = { page, limit: 10, keyword: '' }
                    hotArtTrigger(arg)
                    setPage(page + 1)
                }
            }
            ishandling = false
        }
        function throttle (callback: () => void, time: number) {
            let timer: NodeJS.Timeout | null = null
            return function () {
                if (timer) return
                timer = setTimeout(() => {
                    callback()
                    timer = null
                }, time)
            }
        }
        const throttleArt = throttle(handleScroll, 1000)
        document.addEventListener('scroll', throttleArt)
        return () => { document.removeEventListener('scroll', throttleArt) }
    }, [hotArtTrigger, page, artSize, total, setPage])
}
