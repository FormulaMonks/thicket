import store, { initialState } from '../src/database/store'

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
  })

  describe('Comunities', async () => {
    it('should return an empty set on the first fetch', async () => {
      const communities = await store.communities.getAll()
      expect(communities.length).toBe(0)
    })
  })
})
