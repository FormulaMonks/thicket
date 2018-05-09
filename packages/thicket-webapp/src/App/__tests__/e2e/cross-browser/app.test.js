import getChrome, { close as closeChrome } from '../chrome'
import getFirefox, { close as closeFirefox } from '../firefox'
import getSafari, { clsoe as closeSafari } from '../safari'
import {
  addPublication,
  changeProfileNickname,
  changePublicationMeta,
  checkPublicationMeta,
  clickOnPublicationByIndex,
  deletePublication,
} from '../utils'
import { wrapUp } from '../../../../../test/utils'

const PORT = process.env.PORT || 3000
const URL = `http://localhost:${PORT}`
const checkOnlinePeerNicknameExists = async (page, nickname, browser) => {
  const items = await page.$eval('[data-test="online-peers-list"]', i => i.innerHTML)
  expect(items).toMatch(nickname)
}

let browsersMap
let chrome
let firefox
let safari
let communityLink
let inviteLink

beforeAll(async () => {
  chrome = await getChrome()
  firefox = await getFirefox()
  safari = await getSafari()
  browsersMap = new Map([
    ['chrome', chrome],
    ['firefox', firefox],
    ['safari', safari]
  ])
})

afterAll(async () => {
  await chrome.close()
  await firefox.close()
  await safari.close()
  await closeChrome()
  await closeFirefox()
  await closeSafari()
})

test('create a community', async () => {
  await chrome.goto(URL, { waitUntil: 'domcontentloaded' })
  await chrome.waitFor('[data-test="communities"]')
  await chrome.click('[data-test="communities-new"]')
  await chrome.waitFor('[data-test="community"]')
})

test('make firefox join the community (2 browsers in the community)', async () => {
  communityLink = chrome.url()
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
  expect.assertions(3)
  await safari.goto(inviteLink, { waitUntil: 'domcontentloaded' })
  await chrome.waitFor('[data-test="community-empty-syncing"]')
  await firefox.waitFor('[data-test="community-empty-syncing"]')
  await safari.waitFor('[data-test="community-empty-syncing"]')
  await chrome.waitFor('[data-test="community-empty"]')
  await firefox.waitFor('[data-test="community-empty"]')
  await safari.waitFor('[data-test="community-empty"]')
  for (const [ b, p] of browsersMap.entries()) {
    const count = await p.$$eval('[data-test="online-peers-item"]', items => items.length)
    expect(count).toBe(3)
  }
}, 10000)

test('sync change all nicknames', async done => {
  expect.assertions(9)
  for (const [ browser, page ] of browsersMap.entries()) {
    const newNickname = browser
    await changeProfileNickname({ page, newNickname })
    await page.goto(communityLink, { waitUntil: 'domcontentloaded' })
    // no event nor signal, simply wait it out
    await page.waitFor(500)
    for (const p of browsersMap.values()) {
      await checkOnlinePeerNicknameExists(p, newNickname)
    }
  }
  done()
})

test('sync new publications (one for each browser)', async done => {
  expect.assertions(27)
  let i = 1
  for (const [ browser, page ] of browsersMap.entries()) {
    if (i === 1) {
      await page.click('[data-test="community-empty-new"]')
    } else {
      await page.click('[data-test="community-new"]')
    }
    await addPublication({ page, browser })
    await page.waitFor(100)
    for (const [ b, p ] of browsersMap.entries()) {
      await p.waitFor(`[data-test="community-grid-wrap-${i-1}"]`)
      const count = await p.$$eval('[data-test="community-grid-element"]', items => items.length)
      await checkPublicationMeta({ page: p, index: 0 , nickname: browser,  caption: '' })
      expect(count).toBe(i)
    }
    i++
  }
  done()
}, 30000)

test('sync change all publications’s caption and nickname', async done => {
  expect.assertions(6)
  // creation order of publications: chrome, firefox and safari
  // sorted in descending creation timestamp: safari (0) , firefox (1) and chrome (2)
  let i = 0
  for (const [ browser, page ] of browsersMap.entries()) {
    const newNick = `new nick ${browser}`
    const newCaption = `new caption ${browser}`
    const index = 2 - i
    await page.waitFor('[data-test="community-grid"]')
    await clickOnPublicationByIndex({ page, index })
    await changePublicationMeta({ page, caption: newCaption, nickname: newNick })
    await checkPublicationMeta({ page, index, nickname: newNick, caption: newCaption })
    i++
  }
  done()
}, 30000)

test('sync delete all publications', async done => {
  expect.assertions(9)
  let index = 2
  for (const [ browser, page ] of browsersMap.entries()) {
    await deletePublication({ page, index })
    await page.waitFor(500)
    for (const [ b, p] of browsersMap.entries()) {
      const count = await p.$$eval('[data-test="community-grid-element"]', items => items.length)
      expect(count).toBe(index)
    }
    index--
  }
  done()
})
