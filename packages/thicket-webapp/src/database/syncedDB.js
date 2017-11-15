import EventEmitter from 'events'

const initialState = {
  communitities: new Map(),
  communititesPublications: new Map(),
  publications: new Map(),
}

class DB extends EventEmitter {
  constructor(name, initialState) {
    super()
    this.name = name
    // initial state to ipfs
    this.state = initialState
  }

  get() {
    // data from ipfs
    return Promise.resolve(this.state)
  }

  set(data) {
    // data to ipfs
    this.state = {
      ...this.state,
      ...data,
    }
    this.emit('update')
  }
}

const db = new DB('synced', initialState)

export const updateCommunity = async (communityId, data) => {
  const state = await db.get()
  await db.set({
    ...state,
    communities: new Map([...state.communities, [communityId, data]])
  })
}

export const addPublication = async (communityId, data) => {
  // get id from ipfs
  const id = 'random hash'
  const state = await db.get()
  await db.set({
    ...state,
    publications: new Map([...state.publications, [id, data]]),
    communititesPublications: new Map([
        ...state.communititesPublications,
        [communityId, [...state.communititesPublications[communityId], id]]
    ])
  })
}

export default db
