import puppeteer from 'puppeteer'

const PORT = process.env.PORT || 3000
const URL = `http://localhost:${PORT}`
const URL_COMMUNITIES = `${URL}/#/communities`

let chrome
let page

beforeAll(async () => {
  chrome = await puppeteer.launch({
    headless: process.env.HEADLESS !== 'false',
    args: ['--use-fake-ui-for-media-stream']
  })
  page = await chrome.newPage()
  // set dimensions to full browser screen with experimental feature:
  await page._client.send('Emulation.clearDeviceMetricsOverride')
})

afterAll(async () => {
  await page.close()
  await chrome.close()
})

test('/ route redirects to communities', async () => {
  await page.goto(URL, { waitUntil: 'domcontentloaded' })
  await page.waitFor('[data-test="communities"]')
})

test('initial state has no communities', async () => {
  await page.waitFor('[data-test="communities-empty"]')
})

test('change nickname', async () => {
  const newNickname = 'Nickname'
  await page.click('[data-test="profile-link"]')
  await page.waitFor('[data-test="profile"]')
  await page.$eval('[data-test="profile-input"]', input => input.value = '')
  await page.type('[data-test="profile-input"]', newNickname)
  await page.click('[data-test="profile-save"]')
  await page.waitFor('[data-test="communities"]')
  await page.reload({ waitUntil: 'domcontentloaded' })
  await page.waitFor('[data-test="username-wrap"]')
  const wrapper = await page.$eval('[data-test="username-wrap"]', e => e.innerHTML)
  const initial = await page.$eval('[data-test="username-initial"]', e => e.innerHTML)
  expect(wrapper).toMatch(newNickname)
  expect(initial).toBe(newNickname.substr(0, 1))
})

test('add a new community with top button', async () => {
  await page.click('[data-test="communities-new"]')
  await page.waitFor('[data-test="community"]')
})

test('list the newly posted community', async () => {
  await page.goto(URL_COMMUNITIES, { waitUntil: 'domcontentloaded' })
  await page.waitFor('[data-test="communities"]')
  await page.waitFor('[data-test="communities-list"]')
  const count = await page.$$eval('[data-test="communities-element"]', items => items.length)
  expect(count).toBe(1)
})

test('leave the community (from communities)', async () => {
  await page.click('[data-test="communities-leave"]')
  await page.click('[data-test="leave-btn"]')
  await page.waitFor('[data-test="communities"]')
  await page.waitFor('[data-test="communities-empty"]')
})
