import useSWRMutation from 'swr/mutation'
import { successResult, likePayload, collectionPayload } from '../../type-config';
import { fetchUserLike, fetchDeleteUserLike, fetchUserCollect, fetchDeleteUserCollect } from '../../api_helpers/fetchers'

interface props {
    onSuccessCallback: (data: successResult) => void
}

export default function useArticleReord({ onSuccessCallback }: props) {
    // 新增喜歡
    const { trigger: addLikeTrigger, isMutating: addLikeIsMutating, data: addLikeData, error: addLikeError } = useSWRMutation<successResult, Error>(`likeRecord`, fetchUserLike, { onSuccess: onSuccessCallback});
    // 移除喜歡
    const { trigger: deleteLikeTrigger, isMutating: deleteLikeIsMutating, data: deleteLikeData, error: deleteLikeError } = useSWRMutation<successResult, Error>(`likeRecord`, fetchDeleteUserLike, { onSuccess: onSuccessCallback});
    // 新增收藏
    const { trigger: addCollectTrigger, isMutating: addCollectIsMutating, data: addCollectData, error: addCollectError } = useSWRMutation<successResult, Error>(`collectionRecord`, fetchUserCollect, { onSuccess: onSuccessCallback});
    // 移除收藏
    const { trigger: deleteCollectTrigger, isMutating: deleteCollectIsMutating, data: deleteCollectData, error: deleteCollectError } = useSWRMutation<successResult, Error>(`collectionRecord`, fetchDeleteUserCollect, { onSuccess: onSuccessCallback});

    // 決定 fetch 哪一個 trigger
    function artRecordTrigger (action: string, arg: likePayload | collectionPayload) {
        switch (action) {
            case 'like': {
                return addLikeTrigger(arg)
            }
            case 'deleteLike': {
                return deleteLikeTrigger(arg)
            }
            case 'collect': {
                return addCollectTrigger(arg)
            }
            case 'deleteCollect': {
                return deleteCollectTrigger(arg)
            }
            default: {
                throw Error('Unknown action: ' + action);
            }
        }
    }
    // 決定得到哪一個 isMutating 資訊
    function getRecordIsMutating (action: string) {
        switch (action) {
            case 'like': {
                return addLikeIsMutating
            }
            case 'deleteLike': {
                return deleteLikeIsMutating
            }
            case 'collect': {
                return addCollectIsMutating
            }
            case 'deleteCollect': {
                return deleteCollectIsMutating
            }
            default: {
                throw Error('Unknown action: ' + action);
            }
        }
    }
    return { artRecordTrigger, getRecordIsMutating }
}
