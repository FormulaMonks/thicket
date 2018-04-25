import { createStore } from '../store'
import {
  options,
  cleanup,
  getGIFSource,
  GIF_HASH as PUBLICATION_HASH,
} from '../../../test/utils.js'

const TEST = 'community'
const mock = options(TEST)
const COMMUNITY_ID = 'community-community-id-' + Date.now()
const CREATED_BY = 'TEST'
const CAPTION = 'I am a mock publication'
const PUBLICATION = { createdBy: CREATED_BY, caption: CAPTION, src: '' }

let communities
let user

jest.setTimeout(10000)

beforeAll(async done => {
  // cleanup previous tests
  await cleanup(TEST)
  // store
  const store = createStore(mock('crud'))
  communities = store.communities
  user = store.user
  // community for tests
  await communities.post(COMMUNITY_ID)
  // gif src
  PUBLICATION.src = await getGIFSource()

  done()
})

test('fetch community’s initial data', async () => {
  expect.assertions(5)
  const exists = await communities.has(COMMUNITY_ID)
  const community = await communities.get(COMMUNITY_ID)
  const { communityId } = community
  const { title, size } = await community.get()
  const list = await community.getAllPublications()
  expect(exists).toBe(true)
  expect(communityId).toBe(COMMUNITY_ID)
  expect(title).toBe('')
  expect(size).toBe(0)
  expect(list.length).toBe(0)
})

test('update the community’s title', async () => {
  const newTitle = 'New Title'
  const community = await communities.get(COMMUNITY_ID)
  await community.put({ title: newTitle })
  const { title } = await community.get()
  expect(title).toBe(newTitle)
})

test('initial online peers (only one, user itself)', async () => {
  const community = await communities.get(COMMUNITY_ID)
  const onlinePeers = await community.getOnlinePeers()
  const { nickname } = await user.get()
  expect(onlinePeers).toEqual([nickname])
})

test('post a new publication', async () => {
  expect.assertions(4)
  const instant = Date.now()
  const community = await communities.get(COMMUNITY_ID)
  await community.postPublication(PUBLICATION)
  const [ { caption, id, createdBy, createdAt } ] = await community.getAllPublications()
  expect(caption).toBe(CAPTION)
  expect(id).toBe(PUBLICATION_HASH)
  expect(createdBy).toBe(CREATED_BY)
  expect(createdAt).toBeGreaterThanOrEqual(instant)
})

test('increase community’s size with new publication', async done => {
  expect.assertions(1)
  const community = await communities.get(COMMUNITY_ID)
  community.publications.once('update', async () => {
    // doesn't get cached
    const s = community.publications.getSize()
    // community size gets updated only after getAllPublications (busts cache)
    const list = await community.getAllPublications()
    const { size } = await community.get()
    expect(size).toBe(s)
    done()
  })
  // can only get size after getting publication src
  const p = await community.publications.get(PUBLICATION_HASH)
})

test('delete publication', async () => {
  const community = await communities.get(COMMUNITY_ID)
  await community.deletePublication(PUBLICATION_HASH)
  const list = await community.getAllPublications()
  expect(list).toEqual([])
})

test('decrease community’s size', async done => {
  expect.assertions(2)
  const community = await communities.get(COMMUNITY_ID)
  const s = community.publications.getSize()
  const { size } = await community.get()
  expect(size).toBe(0)
  expect(s).toBe(0)
  done()
})
