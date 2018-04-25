import { createStore } from '../../store'
import {
  options,
  cleanup,
  wrapUp,
  getGIFSource,
  GIF_HASH as PUBLICATION_HASH,
  GIF_SIZE as PUBLICATION_SIZE,
} from '../../../../test/utils.js'

const TEST = 'network-publications'
const mock = options(TEST)
const COMMUNITY_ID = 'network-publications-community-id' + Date.now()
const CREATED_BY = 'Network Community Tests'
const CAPTION = 'Thou shall not pass'
const PUBLICATION = { createdBy: CREATED_BY, caption: CAPTION, src: '' }
const NEW_CAPTION = 'Now I am a GIF'
const sleep = time => new Promise(r => setTimeout(r, time))

let store1
let store2
let store3
let store4

jest.setTimeout(30000)

beforeAll(() => {
  return new Promise(async done => {
    // cleanup
    await cleanup(TEST)
    // stores
    store1 = createStore(mock('store-1'))
    store2 = createStore(mock('store-2'))
    store3 = createStore(mock('store-3'))
    store4 = createStore(mock('store-4'))
    // gif src
    PUBLICATION.src = await getGIFSource()
    // store 1 join/create community
    const community1 = await store1.communities.post(COMMUNITY_ID)
    const promise1 = new Promise(r => {
      community1.once('peer', () => {
        community1.once('synced', r)
      })
    })
    // wait some time, if not, stores do not sync
    await sleep(1000)
    // store 2 join community
    const community2 = await store2.communities.post(COMMUNITY_ID)
    const promise2 = new Promise(r => {
      community2.once('peer', () => {
        community2.once('synced', r)
      })
    })
    // wait for boths stores to sync
    await Promise.all([promise1, promise2])

    done()
  })
})

test('publication post', async done => {
  expect.assertions(14)
  const almostDone = wrapUp(done, 2)
  const instant = Date.now()
  const check = ({ id, caption, createdBy, src, createdAt, ...rest }, cb) => {
    expect(id).toEqual(PUBLICATION_HASH)
    expect(caption).toEqual(CAPTION)
    expect(createdBy).toEqual(CREATED_BY)
    expect(createdAt).toBeGreaterThanOrEqual(instant)
    // make sure there is nothing else there
    expect(Object.keys(rest).length).toBe(0)
    cb()
  }
  const community1 = await store1.communities.get(COMMUNITY_ID)
  const community2 = await store2.communities.get(COMMUNITY_ID)
  community2.publications.once('update', async () => {
    const list = await community2.getAllPublications()
    const [ item ] = list
    expect(list.length).toEqual(1)
    check(item, almostDone)
  })
  community1.publications.once('update', async () => {
    const list = await community1.getAllPublications()
    const [ item ] = list
    expect(list.length).toEqual(1)
    check(item, almostDone)
  })
  const peers1 = await community1.getOnlinePeers()
  const peers2 = await community2.getOnlinePeers()
  expect(peers1.length).toBe(2)
  expect(peers2.length).toBe(2)
  await community2.postPublication(PUBLICATION)
})

test('join and sync community with publication', async done => {
  expect.assertions(5)
  const almostDone = wrapUp(done, 3)
  const community1 = await store1.communities.get(COMMUNITY_ID)
  const community2 = await store2.communities.get(COMMUNITY_ID)
  community1.once('synced', almostDone)
  community2.once('synced', almostDone)
  const community3 = await store3.communities.post(COMMUNITY_ID)
  community3.once('synced', async () => {
    const {
      id,
      createdBy,
      caption,
      src,
      createdAt,
      ...rest,
    } = await community3.publications.get(PUBLICATION_HASH)
    const size = await community3.publications.getSize()
    expect(caption).toEqual(CAPTION)
    expect(id).toBe(PUBLICATION_HASH)
    expect(createdBy).toEqual(CREATED_BY)
    expect(size).toBe(PUBLICATION_SIZE)
    // to make sure there is nothing else there
    expect(Object.keys(rest).length).toBe(0)
    almostDone()
  })
})

test('broadcast changes to the publication', async done => {
  expect.assertions(4)
  const almostDone = wrapUp(done, 2)
  const { publications: publications1 } = await store1.communities.get(COMMUNITY_ID)
  // on purpose setting the createdBy to the store2 user nickname, that's who orignally posted the publication no?
  const { nickname } = await store2.user.get()
  const { publications: publications2 } = await store2.communities.get(COMMUNITY_ID)
  const { publications: publications3 } = await store3.communities.get(COMMUNITY_ID)
  publications2.once('update', async () => {
    const { caption, createdBy } = await publications2.get(PUBLICATION_HASH)
    expect(caption).toBe(NEW_CAPTION)
    expect(createdBy).toBe(nickname)
    almostDone()
  })
  publications3.once('update', async () => {
    const { caption, createdBy } = await publications2.get(PUBLICATION_HASH)
    expect(caption).toBe(NEW_CAPTION)
    expect(createdBy).toBe(nickname)
    almostDone()
  })
  await publications1.put(PUBLICATION_HASH, { createdBy: nickname, caption: NEW_CAPTION })
})

test('join and sync community with publication with changes', async done => {
  expect.assertions(2)
  const almostDone = wrapUp(done, 4)
  const community1 = await store1.communities.get(COMMUNITY_ID)
  const community2 = await store2.communities.get(COMMUNITY_ID)
  const community3 = await store3.communities.get(COMMUNITY_ID)
  community1.once('synced', almostDone)
  community2.once('synced', almostDone)
  community3.once('synced', almostDone)
  const community4 = await store4.communities.post(COMMUNITY_ID)
  community4.once('synced', async () => {
    const { createdBy, caption } = await community4.publications.get(PUBLICATION_HASH)
    const { nickname } = await store2.user.get()
    expect(caption).toEqual(NEW_CAPTION)
    expect(createdBy).toEqual(nickname)
    almostDone()
  })
})

test('broadcast publication delete', async done => {
  expect.assertions(12)
  const community1 = await store1.communities.get(COMMUNITY_ID)
  const list1 = await community1.getAllPublications()
  const community2 = await store2.communities.get(COMMUNITY_ID)
  const list2 = await community2.getAllPublications()
  const community3 = await store3.communities.get(COMMUNITY_ID)
  const list3 = await community3.getAllPublications()
  const community4 = await store4.communities.get(COMMUNITY_ID)
  const list4 = await community4.getAllPublications()
  const almostDone = wrapUp(done, 4)
  const check = async (community, it) => {
    const { publications } = community
    const size = await publications.getSize()
    const meta = await publications.getMetadata()
    const list = await community.getAllPublications()
    expect(size).toBe(0)
    expect(list).toEqual([])
  }
  community1.publications.once('update', async () => {
    await check(community1)
    almostDone()
  })
  community2.publications.once('update', async () => {
    await check(community2)
    almostDone()
  })
  community3.publications.once('update', async () => {
    await check(community3)
    almostDone()
  })
  community4.publications.once('update', async () => {
    await check(community4)
    almostDone()
  })
  expect(list1.length).toBe(1)
  expect(list2.length).toBe(1)
  expect(list3.length).toBe(1)
  expect(list4.length).toBe(1)
  await community3.deletePublication(PUBLICATION_HASH)
})