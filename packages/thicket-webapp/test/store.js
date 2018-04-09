import store, { initialState } from '../src/database/store'
global.addEventListener = (str, cb) => cb()

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
    it('should return false when checking if the user has a non-existent community', async () => {
      const nonExistentCommunityId = 'non existent community id'
      const exists = await store.communities.has(nonExistentCommunityId)
      expect(exists).toBe(false)
    })
    it('should add a new community', async () => {
      const { communities } = store
      const newId = 'new community id'
      await communities.post(newId)
      const exists = await communities.has(newId)
      expect(exists).toBe(true)
    })
    it('should fetch the new community’s data', async () => {
      const { communities } = store
      const newId = 'new community id'
      await communities.post(newId)
      const {
        communityId,
        data,
        onlinePeers,
        publications: { list }
      } = await communities.get(newId)
      expect(communityId).toBe(newId)
      expect(data).toBe(null)
      expect(onlinePeers).toBe(null)
      expect(list.length).toBe(0)
    })
  })
})
