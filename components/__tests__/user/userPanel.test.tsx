import UserPanel from "../../user/userPanel";
import { render } from '@testing-library/react'

describe('user panel show', () => {
    const mockCurrentUser = { name: 'raven', email: 'raven@woodsy.com', birthday: new Date(1992, 6, 13), role: 'user' }
    test('name render', () => {

        const mockEditUser = jest.fn()
        const { container } = render(<UserPanel currentUserDetail={mockCurrentUser} handleEditUser={mockEditUser} />)
        let showArea = container.querySelector('.show-name') as HTMLSpanElement;
        expect(showArea.innerText === mockCurrentUser.name)
    })
    // test('email render', () => {

    // })
});

