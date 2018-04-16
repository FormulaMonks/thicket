import store, { initialState } from '../store'
import db from '../'

describe('Store', () => {
  it('should expose user & communities interface', () => {
    expect.assertions(2)
    expect(store.hasOwnProperty('user')).toBe(true)
    expect(store.hasOwnProperty('communities')).toBe(true)
  })
})
