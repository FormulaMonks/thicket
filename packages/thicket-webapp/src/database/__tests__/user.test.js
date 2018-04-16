import store, { initialState } from '../store'

describe('User', () => {
  it('should return the initial state on the first fetch', async () => {
    const user = await store.user.get()
    expect(user).toBe(initialState.user)
  })
  it('should set the user’s nickname to the new value', async () => {
    const newNickname = 'new nickname'
    const { user } = store
    await user.put({ nickname: newNickname })
    const { nickname } = await user.get()
    expect(nickname).toBe(newNickname)
  })
})
