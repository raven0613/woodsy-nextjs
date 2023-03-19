import { atom } from "recoil";
import { Iuser } from "../type-config";

const currentUserState = atom<Iuser>({
    key: 'currentUser',
    default: {
        id: 0,
        name: '',
        email: '',
        role: ''
    }
})

export { currentUserState }