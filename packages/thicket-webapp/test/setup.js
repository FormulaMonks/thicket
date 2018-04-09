import 'babel-polyfill'
import 'jest-localstorage-mock'

global.addEventListener = (str, cb) => cb()
