import store from '../store'
import db from '../'
import { options, cleanup } from '../../../test/utils.js'

const TEST = 'store.communities'
const mock = options(TEST)

beforeAll(async done => {
  // cleanup previous tests
  await cleanup(TEST)
  await db._initIPFS(mock('crud'))
  done()
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
    const newId = 'new-community-id-' + Date.now()
    await communities.post(newId)
    const exists = await communities.has(newId)
    expect(exists).toBe(true)
  })
  it('should fetch the new community’s data', async () => {
    expect.assertions(6)
    const { communities } = store
    const newId = 'new-community-id'
    let exists = await store.communities.has(newId)
    expect(exists).toBe(false)
    await communities.post(newId)
    const {
      communityId,
      data,
      onlinePeers,
      publications: { list }
    } = await communities.get(newId)
    exists = await store.communities.has(newId)
    expect(exists).toBe(true)
    expect(communityId).toBe(newId)
    expect(data).toBe(null)
    expect(onlinePeers).toBe(null)
    expect(list.length).toBe(0)
  })
  it('should persist the community id from last test ', async () => {
    expect.assertions(1)
    const newId = 'new-community-id'
    let exists = await store.communities.has(newId)
    expect(exists).toBe(true)
  })
})
