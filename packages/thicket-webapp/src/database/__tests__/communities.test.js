import store, { createStore } from '../store'
import { options, cleanup } from '../../../test/utils.js'

const TEST = 'communities'
const mock = options(TEST)
const randomId = () => `random-community-id-${Date.now()}-${Math.random()}`

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
    const nonExistentCommunityId = randomId()
    const exists = await communities.has(nonExistentCommunityId)
    expect(exists).toBe(false)
  })
  it('should add a new community', async () => {
    const newId = randomId()
    await communities.post(newId)
    const exists = await communities.has(newId)
    expect(exists).toBe(true)
  })
  it('should emit an update when a new community is posted', async done => {
    expect.assertions(1)
    const newId = randomId()
    communities.once('update', async () => {
      const exists = await communities.has(newId)
      expect(exists).toBe(true)
      done()
    })
    await communities.post(newId)
  })
  it('should fetch the new community’s data', async () => {
    expect.assertions(4)
    const newId = randomId()
    let exists = await communities.has(newId)
    expect(exists).toBe(false)
    const community = await communities.post(newId)
    const list = await community.getAllPublications()
    exists = await communities.has(newId)
    expect(exists).toBe(true)
    expect(community.communityId).toBe(newId)
    expect(list.length).toBe(0)
  })
  it('should leave all communities', async () => {
    expect.assertions(1)
    let userCommunities = await communities.getAll()
    for (const communityId of userCommunities) {
      await communities.delete(communityId)
    }
    userCommunities = await communities.getAll()
    expect(userCommunities.length).toBe(0)
  })
})
