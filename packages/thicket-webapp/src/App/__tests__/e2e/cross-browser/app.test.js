import getChrome from '../chrome'
import getFirefox from '../firefox'
import getSafari from '../safari'

const PORT = process.env.PORT || 3000
const URL = `http://localhost:${PORT}`
const URL_COMMUNITIES = `${URL}/#/communities`

let chrome
let firefox
let safari
let inviteLink

beforeAll(async done => {
  chrome = await getChrome()
  firefox = await getFirefox()
  safari = await getSafari()
  done()
})

afterAll(async done => {
  await chrome.close()
  await firefox.close()
  await safari.close()
  done()
})

test('create a community', async () => {
  await chrome.goto(URL, { waitUntil: 'domcontentloaded' })
  await chrome.waitFor('[data-test="communities"]')
  await chrome.click('[data-test="communities-new"]')
  await chrome.waitFor('[data-test="community"]')
})

test('make firefox join the community (2 browsers in the community)', async () => {
  inviteLink = await chrome.$eval('[data-test="community-invite-link"]', i => i.value)
  await firefox.goto(inviteLink, { waitUntil: 'domcontentloaded' })
  await chrome.waitFor('[data-test="community-empty-syncing"]')
  await firefox.waitFor('[data-test="community-empty-syncing"]')
  await chrome.waitFor('[data-test="community-empty"]')
  await firefox.waitFor('[data-test="community-empty"]')
  const countChrome = await chrome.$$eval('[data-test="online-peers-item"]', items => items.length)
  const countFirefox = await firefox.$$eval('[data-test="online-peers-item"]', items => items.length)
  expect(countChrome).toBe(2)
  expect(countFirefox).toBe(2)
}, 10000)

test('make safari join the community (3 browsers in the community)', async () => {
  await safari.goto(inviteLink, { waitUntil: 'domcontentloaded' })
  await chrome.waitFor('[data-test="community-empty-syncing"]')
  await firefox.waitFor('[data-test="community-empty-syncing"]')
  await safari.waitFor('[data-test="community-empty-syncing"]')
  await chrome.waitFor('[data-test="community-empty"]')
  await firefox.waitFor('[data-test="community-empty"]')
  await safari.waitFor('[data-test="community-empty"]')
  const countChrome = await chrome.$$eval('[data-test="online-peers-item"]', items => items.length)
  const countFirefox = await firefox.$$eval('[data-test="online-peers-item"]', items => items.length)
  const countSafari = await safari.$$eval('[data-test="online-peers-item"]', items => items.length)
  expect(countChrome).toBe(3)
  expect(countFirefox).toBe(3)
  expect(countSafari).toBe(3)
})
