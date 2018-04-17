import fs from 'fs'
import { promisify } from 'util'
import store from '../store'
import db from '../'
import { options, cleanup } from '../../../test/utils.js'

const TEST = 'community'
const mock = options(TEST)
const { communities } = store
const COMMUNITY_ID = 'community-id'
const CREATED_BY = 'TEST'
const CAPTION = 'I am a mock publication'
const PUBLICATION = { createdBy: CREATED_BY, caption: CAPTION, src: '' }
const PUBLICATION_HASH = 'QmYWRS7rqok7zvFBmAm1JBbzPEAMdkkfxwfhfPNoX9vAuQ'
const getContents = promisify(fs.readFile)

jest.setTimeout(10000)

beforeAll(async done => {
  // cleanup previous tests
  await cleanup(TEST)
  await db._initIPFS(mock('crud'))
  await communities.post(COMMUNITY_ID)
  const src = await getContents(__dirname + '/gif.gif')
  PUBLICATION.src = src.toString()
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

  it('should update the community’s title', async () => {
    const newTitle = 'New Title'
    const community = await communities.get(COMMUNITY_ID)
    await community.put({ title: newTitle })
    const { data: { title } } = await communities.get(COMMUNITY_ID)
    expect(title).toBe(newTitle)
  })

  it('should receive no publications on initial data', async () => {
    const community = await communities.get(COMMUNITY_ID)
    const list = await community.getAllPublications()
    expect(list).toEqual([])
  })

  it('should receive initial online peers (only one, user itself)', async () => {
    const community = await communities.get(COMMUNITY_ID)
    const onlinePeers = await community.getOnlinePeers()
    const { nickname } = await store.user.get()
    expect(onlinePeers).toEqual([nickname])
  })

  it('should post a new publication', async () => {
    expect.assertions(4)
    const community = await communities.get(COMMUNITY_ID)
    await community.postPublication(PUBLICATION)
    const [ item ] = await community.getAllPublications()
    expect(item.caption).toBe(CAPTION)
    expect(item.id).toBe(PUBLICATION_HASH)
    expect(item.createdBy).toBe(CREATED_BY)
    expect(item.hasOwnProperty('createdAt')).toBe(true)
  })
})
