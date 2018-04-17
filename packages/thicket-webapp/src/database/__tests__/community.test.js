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

  it('should fetch the community’s initial data', async () => {
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

  it('should update the community’s title', async () => {
    const newTitle = 'New Title'
    const community = await communities.get(COMMUNITY_ID)
    await community.put({ title: newTitle })
    const { title } = await community.get()
    expect(title).toBe(newTitle)
  })

  it('should receive correct initial online peers (only one, user itself)', async () => {
    const community = await communities.get(COMMUNITY_ID)
    const onlinePeers = await community.getOnlinePeers()
    const { nickname } = await store.user.get()
    expect(onlinePeers).toEqual([nickname])
  })

  it('should post a new publication', async () => {
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

  it('should increase the community’s size with the new publication', async done => {
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

  it('should delete a publication', async () => {
    const community = await communities.get(COMMUNITY_ID)
    await community.deletePublication(PUBLICATION_HASH)
    const list = await community.getAllPublications()
    expect(list).toEqual([])
  })

  it('should decrease the community’s size', async done => {
    expect.assertions(2)
    const community = await communities.get(COMMUNITY_ID)
    const s = community.publications.getSize()
    const { size } = await community.get()
    expect(size).toBe(0)
    expect(s).toBe(0)
    done()
  })
})
