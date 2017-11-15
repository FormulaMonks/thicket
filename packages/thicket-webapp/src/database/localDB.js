import { EventEmitter } from 'events'
import localForage from 'localforage'
import uuid from 'uuid'

// onboarding
export const ARRIVED = 'first time user'
export const ONBOARD = 'quick presentation of what thicket is'
export const CAMERA_ACCESS = 'we need to be able to access the camera'
export const CREATE = 'user is shooting first gif'
export const COMPLETE = 'user has finished onboarding'

const initialState = {
  nickname: `Guest${Math.floor(1 + Math.random() * 1000)}`,
  communities: new Set(),
  onboarding: ARRIVED,
  hasDoneFirstGIF: false,
  hasDoneCommunityOnboarding: false,
}

class DB extends EventEmitter {
  constructor(name, initialState) {
    super()
    this.name = name
    this.init(initialState)
  }

  async init() {
    const state = await this.get()
    await this.set({ ...initialState, ...state })
  }

  async get() {
    return await localForage.getItem(this.name)
  }

  async set(data) {
    await localForage.setItem(this.name, data)
    this.emit('update')
  }
}

const db = new DB('local', initialState)

const updateDB = async data => {
  const state = await db.get()
  await db.set({ ...state, ...data, })
}

export const updateNickname = nickname => updateDB({ nickname })
export const updateOnboarding = onboarding => updateDB({ onboarding })

export const addCommunity = async () => {
  const newId = uuid()
  const state = await db.get()
  await db.set({
    ...state,
    communities: [...state.communities, newId]
  })
  return newId
}

export default db
