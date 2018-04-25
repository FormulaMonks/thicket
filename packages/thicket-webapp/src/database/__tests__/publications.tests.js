import { createStore } from '../store'
import {
  options,
  cleanup,
  getGIFSource,
  GIF_HASH as PUBLICATION_HASH,
  GIF_SIZE as PUBLICATION_SIZE,
} from '../../../test/utils.js'

const TEST = 'publications'
const mock = options(TEST)
const COMMUNITY_ID = 'publications-community-id-' + Date.now()
const CREATED_BY = 'Publications Tests'
const CAPTION = 'I am a real GIF'
const PUBLICATION = { createdBy: CREATED_BY, caption: CAPTION, src: '' }

let communities

jest.setTimeout(10000)

beforeAll(() => {
  return new Promise(async done => {
    // cleanup previous tests
    await cleanup(TEST)
    // store
    const store = createStore(mock('crud'))
    communities = store.communities
    // community
    await communities.post(COMMUNITY_ID)
    // gif src
    PUBLICATION.src = await getGIFSource()

    done()
  })
})

 test('start out with no publications', async () => {
   const community = await communities.get(COMMUNITY_ID)
   const list = await community.getAllPublications()
   expect(list).toEqual([])
 })

 test('receive update after a new publication post', async done => {
   expect.assertions(6)
   const instant = Date.now()
   const community = await communities.get(COMMUNITY_ID)
   const { publications } = community
   publications.once('update', async () => {
     const list = await publications.getAll()
     const [ { id, caption, createdBy, src, createdAt, ...rest } ] = list
     expect(list.length).toEqual(1)
     expect(id).toEqual(PUBLICATION_HASH)
     expect(caption).toEqual(CAPTION)
     expect(createdBy).toEqual(CREATED_BY)
     expect(createdAt).toBeGreaterThanOrEqual(instant)
     // to make sure there is nothing else there
     expect(Object.keys(rest).length).toBe(0)
     done()
   })
   await community.postPublication(PUBLICATION)
 })

 test('get all publications', async () => {
   const { publications } = await communities.get(COMMUNITY_ID)
   const list = await publications.getAll()
   expect(list.length).toEqual(1)
 })

 test('get the publication’s data', async () => {
   const { publications } = await communities.get(COMMUNITY_ID)
   const {
     id,
     caption,
     createdBy,
     src,
     createdAt,
     ...rest
   } = await publications.get(PUBLICATION_HASH)
   expect(id).toEqual(PUBLICATION_HASH)
   expect(caption).toEqual(CAPTION)
   expect(createdBy).toEqual(CREATED_BY)
   // to make sure there is nothing else there
   expect(Object.keys(rest).length).toBe(0)
 })

 test('get the publication’s metadata (no src)', async () => {
   const { publications } = await communities.get(COMMUNITY_ID)
   const {
     id,
     caption,
     createdBy,
     createdAt,
     ...rest,
   } = await publications.get(PUBLICATION_HASH)
   expect(id).toEqual(PUBLICATION_HASH)
   expect(caption).toEqual(CAPTION)
   expect(createdBy).toEqual(CREATED_BY)
   // to make sure there is nothing else there
   expect(Object.keys(rest).length).toBe(0)
 })

 test('get publications aggregated size', async done => {
   expect.assertions(1)
   const { publications } = await communities.get(COMMUNITY_ID)
   publications.once('update', async () => {
     const size = await publications.getSize()
     expect(size).toBe(PUBLICATION_SIZE)
     done()
   })
   // can only get size after getting publication src
   const item = await publications.get(PUBLICATION_HASH)
 })

 test('update publication’s caption and createdBy properties', async () => {
   const { publications } = await communities.get(COMMUNITY_ID)
   const newNickname = 'Other nickname'
   const newCaption = 'To GIF or not to GIF'
   await publications.put(PUBLICATION_HASH, { createdBy: newNickname, caption: newCaption })
   const {
     id,
     createdBy,
     caption,
     src,
     createdAt,
     ...rest,
   } = await publications.get(PUBLICATION_HASH)
   expect(caption).toEqual(newCaption)
   expect(createdBy).toEqual(newNickname)
   // to make sure there is nothing else there
   expect(Object.keys(rest).length).toBe(0)
 })

 test('receive update after publication’s caption and createdBy properties are updated', async done => {
   expect.assertions(3)
   const { publications } = await communities.get(COMMUNITY_ID)
   const newNickname = 'Some other nickname'
   const newCaption = ''
   publications.once('update', async () => {
     const {
       id,
       createdBy,
       caption,
       src,
       createdAt,
       ...rest,
     } = await publications.get(PUBLICATION_HASH)
     expect(caption).toEqual(newCaption)
     expect(createdBy).toEqual(newNickname)
     // to make sure there is nothing else there
     expect(Object.keys(rest).length).toBe(0)
     done()
   })
   await publications.put(PUBLICATION_HASH, { createdBy: newNickname, caption: newCaption })
 })

 test('delete publication', async () => {
   const community = await communities.get(COMMUNITY_ID)
   await community.deletePublication(PUBLICATION_HASH)
   const list = await community.getAllPublications()
   expect(list).toEqual([])
 })

 test('update publications’s size after a publication has been deleted', async () => {
   const { publications } = await communities.get(COMMUNITY_ID)
   const size = await publications.getSize()
   expect(size).toBe(0)
 })

 test('receive update after publication has been deleted', async done => {
   expect.assertions(1)
   const community = await communities.get(COMMUNITY_ID)
   const { publications } = community
   await community.postPublication(PUBLICATION)
   publications.once('update', async () => {
     const list = await community.getAllPublications()
     expect(list).toEqual([])
     done()
   })
   await community.deletePublication(PUBLICATION_HASH)
 })
