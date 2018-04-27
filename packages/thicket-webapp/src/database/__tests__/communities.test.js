import { createStore } from '../store'
import { options, cleanup } from '../../../test/utils.js'

const TEST = 'communities'
const mock = options(TEST)
const randomId = () => `communities-random-community-id-${Date.now()}-${Math.random()}`

let communities

jest.setTimeout(10000)

beforeAll(async done => {
  // cleanup previous tests
  await cleanup(TEST)
  // store
  const store = createStore(mock('crud'))
  communities = store.communities

  done()
})

test('zero communities on first fetch', async () => {
  const userCommunities = await communities.getAll()
  expect(userCommunities.length).toBe(0)
})

test('check for non-existing community', async () => {
  const communityId = randomId()
  const exists = await communities.has(communityId)
  expect(exists).toBe(false)
})

test('add a new community', async () => {
  const newId = randomId()
  await communities.post(newId)
  const exists = await communities.has(newId)
  expect(exists).toBe(true)
})

test('receive update for new community', async done => {
  expect.assertions(1)
  const newId = randomId()
  communities.once('update', async () => {
    const exists = await communities.has(newId)
    expect(exists).toBe(true)
    done()
  })
  await communities.post(newId)
})

test('fetch new community’s data', async () => {
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

test('leave all communities', async () => {
  expect.assertions(1)
  let userCommunities = await communities.getAll()
  for (const communityId of userCommunities) {
    await communities.delete(communityId)
  }
  userCommunities = await communities.getAll()
  expect(userCommunities.length).toBe(0)
})
