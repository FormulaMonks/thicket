import store, { createStore } from '../store'
import { options, cleanup } from '../../../test/utils.js'

const TEST = 'communities'
const mock = options(TEST)

let communities

jest.setTimeout(10000)

beforeAll(async done => {
  // cleanup previous tests
  await cleanup(TEST)
  createStore(mock('crud'))
  communities = store.communities
  done()
})

describe('Communities', async () => {
  it('should return an empty set on the first fetch', async () => {
    const userCommunities = await communities.getAll()
    expect(userCommunities.length).toBe(0)
  })
  it('should return false when checking if the user has a non-existent community', async () => {
    const nonExistentCommunityId = 'non existent community id'
    const exists = await communities.has(nonExistentCommunityId)
    expect(exists).toBe(false)
  })
  it('should add a new community', async () => {
    const newId = 'new-community-id-' + Date.now()
    await communities.post(newId)
    const exists = await communities.has(newId)
    expect(exists).toBe(true)
  })
  it('should fetch the new community’s data', async () => {
    expect.assertions(6)
    const newId = 'new-community-id'
    let exists = await communities.has(newId)
    expect(exists).toBe(false)
    await communities.post(newId)
    const {
      communityId,
      data,
      onlinePeers,
      publications: { list }
    } = await communities.get(newId)
    exists = await communities.has(newId)
    expect(exists).toBe(true)
    expect(communityId).toBe(newId)
    expect(data).toBe(null)
    expect(onlinePeers).toBe(null)
    expect(list.length).toBe(0)
  })
  it('should persist the community id from last test ', async () => {
    expect.assertions(1)
    const newId = 'new-community-id'
    let exists = await communities.has(newId)
    expect(exists).toBe(true)
  })
  it('should leave all the user communities', async () => {
    expect.assertions(1)
    let userCommunities = await communities.getAll()
    for (const communityId of userCommunities) {
      await communities.delete(communityId)
    }
    userCommunities = await communities.getAll()
    expect(userCommunities.length).toBe(0)
  })
})
