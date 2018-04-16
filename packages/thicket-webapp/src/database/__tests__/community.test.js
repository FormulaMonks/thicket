import store from '../store'
import db from '../'
import { options, cleanup } from '../../../test/utils.js'

const TEST = 'community'
const mock = options(TEST)
const { communities } = store
const COMMUNITY_ID = 'community-id'

beforeAll(async done => {
  // cleanup previous tests
  await cleanup(TEST)
  await db._initIPFS(mock('crud'))
  await communities.post(COMMUNITY_ID)
  done()
})

describe('Community', async () => {

  it('should fetch the community’s data', async () => {
    expect.assertions(5)
    const {
      communityId,
      data,
      onlinePeers,
      publications: { list }
    } = await communities.get(COMMUNITY_ID)
    const exists = await communities.has(COMMUNITY_ID)
    expect(exists).toBe(true)
    expect(communityId).toBe(COMMUNITY_ID)
    expect(data).toBe(null)
    expect(onlinePeers).toBe(null)
    expect(list.length).toBe(0)
  })
})
