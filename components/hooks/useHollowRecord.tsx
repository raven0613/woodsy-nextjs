import useSWRMutation from 'swr/mutation'
import { successResult, likePayload, collectionPayload } from '../../type-config';
import { fetchUserSub, fetchDeleteUserSub } from '../../api_helpers/fetchers'

interface props {
    onSuccessCallback: (data: successResult) => void
}

export default function useHollowRecord({ onSuccessCallback }: props) {
    // 新增喜歡
    const { trigger: addSubTrigger, isMutating: addSubIsMutating, data: addSubData, error: addSubError } = useSWRMutation<successResult, Error>(`subRecord`, fetchUserSub, { onSuccess: onSuccessCallback});
    // 移除喜歡
    const { trigger: deleteSubTrigger, isMutating: deleteSubIsMutating, data: deleteSubData, error: deleteSubError } = useSWRMutation<successResult, Error>(`subRecord`, fetchDeleteUserSub, { onSuccess: onSuccessCallback});

    // 決定 fetch 哪一個 trigger
    function hollowRecordTrigger (action: string, arg: likePayload | collectionPayload) {
        switch (action) {
            case 'sub': {
                return addSubTrigger(arg)
            }
            case 'deleteSub': {
                return deleteSubTrigger(arg)
            }
            default: {
                throw Error('Unknown action: ' + action);
            }
        }
    }
    // 決定得到哪一個 isMutating 資訊
    function getHollowRecordIsMutating (action: string) {
        switch (action) {
            case 'sub': {
                return addSubIsMutating
            }
            case 'deleteSub': {
                return deleteSubIsMutating
            }
            default: {
                throw Error('Unknown action: ' + action);
            }
        }
    }
    return { hollowRecordTrigger, getHollowRecordIsMutating }
}
