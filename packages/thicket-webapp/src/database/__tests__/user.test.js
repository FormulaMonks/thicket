import { createStore, initialState } from '../store'
import { options,  cleanup } from '../../../test/utils.js'

const TEST = 'user'
const mock = options(TEST)
const { user } = createStore(mock('crud'))

describe('User', () => {

  it('should return the initial state on the first fetch', async () => {
    const data = await user.get()
    expect(data).toEqual(initialState.user)
  })

  it('should set the user’s nickname to the new value', async () => {
    const newNickname = 'new nickname'
    await user.put({ nickname: newNickname })
    const { nickname } = await user.get()
    expect(nickname).toBe(newNickname)
  })

  it('should emit when user’s data changes', async () => {
    expect.assertions(1)
    const newNickname = 'other new nickname'
    user.once('update', async () => {
      const { nickname } = await user.get()
      expect(nickname).toBe(newNickname)
    })
    await user.put({ nickname: newNickname })
  })
})
