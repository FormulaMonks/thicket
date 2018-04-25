import { createStore, initialState } from '../store'
import { options,  cleanup } from '../../../test/utils.js'

const TEST = 'user'
const mock = options(TEST)
const { user } = createStore(mock('crud'))

test('initial state on first fetch', async () => {
  const data = await user.get()
  expect(data).toEqual(initialState.user)
})

test('change user’s nickname', async () => {
  const newNickname = 'new nickname'
  await user.put({ nickname: newNickname })
  const { nickname } = await user.get()
  expect(nickname).toBe(newNickname)
})

test('receive event after user’s nickname changes', async () => {
  expect.assertions(1)
  const newNickname = 'other new nickname'
  user.once('update', async () => {
    const { nickname } = await user.get()
    expect(nickname).toBe(newNickname)
  })
  await user.put({ nickname: newNickname })
})
