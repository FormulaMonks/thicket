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
  await store1.communities.post(COMMUNITY_ID)
  await store2.communities.post(COMMUNITY_ID)
  done()
})

describe('Community', () => {
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
})
