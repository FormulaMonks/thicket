import { createStore } from '../../store'
import { options, cleanup } from '../../../../test/utils.js'

const TEST = 'network-community'
const mock = options(TEST)

jest.setTimeout(10000)

beforeAll(async done => {
  await cleanup(TEST)
  done()
})

const wrapUp = (cb, times) => () => {
  times--
  if (times < 1) {
    cb()
  }
}

describe('Community', () => {
  it('should connect two nodes to the same community', async done => {
    expect.assertions(2)
    const almostDone = wrapUp(done, 2)
    const COMMUNITY_ID = 'community-id'
    const NICKNAME_1 = 'nickname-1'
    const NICKNAME_2 = 'nickname-2'
    const store1 = createStore(mock('store-1'))
    await store1.user.put({ nickname: NICKNAME_1 })
    const community1 = await store1.communities.post(COMMUNITY_ID)
    community1.once('synced', async () => {
      const peers = await community1.getOnlinePeers()
      expect(peers).toEqual([NICKNAME_1, NICKNAME_2])
      almostDone()
    })
    const store2 = createStore(mock('store-2'))
    await store2.user.put({ nickname: NICKNAME_2 })
    const community2 = await store2.communities.post(COMMUNITY_ID)
    community2.once('synced', async () => {
      const peers = await community2.getOnlinePeers()
      expect(peers).toEqual([NICKNAME_2, NICKNAME_1])
      almostDone()
    })
  })
})
