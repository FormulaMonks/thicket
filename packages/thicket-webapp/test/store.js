import store, { initialState } from '../src/database/store'

beforeEach(() => {
  localStorage.clear()
})

describe('Store', () => {
  it('should expose user & communities interface', () => {
    expect(store.hasOwnProperty('user')).toBe(true)
    expect(store.hasOwnProperty('communities')).toBe(true)
  })

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

  describe('Communities', async () => {
    it('should return an empty set on the first fetch', async () => {
      const communities = await store.communities.getAll()
      expect(communities.length).toBe(0)
    })
  })
})
