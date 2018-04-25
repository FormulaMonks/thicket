import { createStore, initialState } from '../store'
import { options,  cleanup } from '../../../test/utils.js'

const TEST = 'store'
const mock = options(TEST)
const store = createStore(mock('interface'))

test('expose user & communities interface', () => {
  expect.assertions(2)
  expect(store.hasOwnProperty('user')).toBe(true)
  expect(store.hasOwnProperty('communities')).toBe(true)
})
