import { createStore } from '../../store'
import {
  options,
  cleanup,
  getGIFSource,
  wrapUp,
  GIF_HASH as PUBLICATION_HASH,
  GIF_SIZE as PUBLICATION_SIZE,
} from '../../../../test/utils.js'

const TEST = 'network-community'
const mock = options(TEST)
const COMMUNITY_ID = 'community-id' + Date.now()
const NICKNAME_1 = 'nickname-1'
const NICKNAME_2 = 'nickname-2'
const CREATED_BY = 'Network Community Tests'
const CAPTION = 'Thou shall not pass'
const PUBLICATION = { createdBy: CREATED_BY, caption: CAPTION, src: '' }

let store1
let store2

jest.setTimeout(15000)

beforeAll(async done => {
  await cleanup(TEST)
  store1 = createStore(mock('store-1'))
  store2 = createStore(mock('store-2'))
  PUBLICATION.src = await getGIFSource()
  done()
})

describe('Community', () => {
  it('should connect two nodes to the same community', async done => {
    expect.assertions(2)
    const almostDone = wrapUp(done, 2)
    const community1 = await store1.communities.post(COMMUNITY_ID)
    community1.once('synced', async () => {
      const peers = await community1.getOnlinePeers()
      const { nickname: nick1 } = await store1.user.get()
      const { nickname: nick2} = await store1.user.get()
      expect(peers).toEqual([nick1, nick2])
      almostDone()
    })
    const community2 = await store2.communities.post(COMMUNITY_ID)
    community2.once('synced', async () => {
      const peers = await community2.getOnlinePeers()
      const { nickname: nick1 } = await store1.user.get()
      const { nickname: nick2} = await store1.user.get()
      expect(peers).toEqual([nick2, nick1])
      almostDone()
    })
  })
  it('should receive the event from the community title update', async done => {
    expect.assertions(2)
    const almostDone = wrapUp(done, 2)
    const newTitle = 'A community title'
    const community1 = await store1.communities.get(COMMUNITY_ID)
    const community2 = await store2.communities.get(COMMUNITY_ID)
    community1.once('update', async () => {
      const { title } = await community1.get()
      expect(title).toBe(newTitle)
      almostDone()
    })
    community2.once('update', async () => {
      const { title } = await community2.get()
      expect(title).toBe(newTitle)
      almostDone()
    })
    await community1.put({ title: newTitle })
  })
  it('should receive the event from the nickname update', async done => {
    expect.assertions(2)
    const almostDone = wrapUp(done, 2)
    const newNickname = 'The Roadster'
    const community1 = await store1.communities.get(COMMUNITY_ID)
    const community2 = await store2.communities.get(COMMUNITY_ID)
    const { nickname } = await store1.user.get()
    community2.once('peer', async () => {
      const peers = await community2.getOnlinePeers()
      expect(peers).toEqual([newNickname, nickname])
      almostDone()
    })
    community1.once('peer', async () => {
      const peers = await community1.getOnlinePeers()
      expect(peers).toEqual([nickname, newNickname])
      almostDone()
    })
    await store2.user.put({ nickname: newNickname })
  })
  it('should receive the event from the publication post', async done => {
    expect.assertions(12)
    const almostDone = wrapUp(done, 2)
    const instant = Date.now()
    const check = ({ id, caption, createdBy, src, createdAt, ...rest}, cb) => {
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
    await community2.postPublication(PUBLICATION)
  })
  it('should receive the event from the peer that left', async done => {
    expect.assertions(1)
    const community1 = await store1.communities.get(COMMUNITY_ID)
    community1.once('peer', async () => {
      const { nickname } = await store1.user.get()
      const peers = await community1.getOnlinePeers()
      expect(peers).toEqual([nickname])
      done()
    })
    store2.communities.delete(COMMUNITY_ID)
  })
  it('should receive the events from the peer that joined', async done => {
    expect.assertions(1)
    const almostDone = wrapUp(done, 3)
    const store3 = createStore(mock('store-3'))
    const community1 = await store1.communities.get(COMMUNITY_ID)
    community1.once('peer', almostDone)
    community1.once('syncing', almostDone)
    community1.once('synced', async () => {
      const peers = await community1.getOnlinePeers()
      const { nickname: nick1 } = await store1.user.get()
      const { nickname: nick3 } = await store3.user.get()
      expect(peers).toEqual([nick1, nick3])
      almostDone()
    })
    await store3.communities.post(COMMUNITY_ID)
  })
})