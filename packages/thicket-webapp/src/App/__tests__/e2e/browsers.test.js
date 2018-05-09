import getChrome, { close as closeChrome } from './chrome'
import getFirefox, { close as closeFirefox } from './firefox'
import getSafari, { close as closeSafari } from './safari'
import {
  addPublication,
  changeProfileNickname,
  changePublicationMeta,
  checkPublicationMeta,
  clickOnPublicationByIndex,
  deletePublication,
} from './utils'

const PORT = process.env.PORT || 3000
const URL = `http://localhost:${PORT}`
const URL_COMMUNITIES = `${URL}/#/communities`
const URL_404 = `${URL}/#/404`
const BROWSERS = ['chrome', 'firefox', 'safari']
const browsers = process.env.BROWSER && BROWSERS.includes(process.env.BROWSER)
  ? [process.env.BROWSER]
  : BROWSERS
const newNickname = 'Nickname'
const customCaption = 'Custom Caption'

browsers.forEach(async browser => {
  describe(`Browser: ${browser}`, () => {
    let page

    beforeAll(async () => {
      page = browser === 'chrome'
        ? await getChrome()
        : browser === 'firefox'
          ? await getFirefox()
          : await getSafari()
    })

    afterAll(async () => {
      await page.close()
      await browser === 'chrome'
        ? await closeChrome()
        : browser === 'firefox'
          ? await closeFirefox()
          : await closeSafari()
    })

    test('/ route redirects to communities', async () => {
      await page.goto(URL, { waitUntil: 'domcontentloaded' })
      await page.waitFor('[data-test="communities"]')
    })

    test('initial state has no communities', async () => {
      await page.waitFor('[data-test="communities-empty"]')
    })

    test('change profile nickname', async () => {
      await changeProfileNickname({ page, newNickname})
      await page.goto(URL_COMMUNITIES, { waitUntil: 'domcontentloaded' })
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

    test('add a new community with center button', async () => {
      await page.click('[data-test="communities-empty-new"]')
      await page.waitFor('[data-test="community"]')
    })

    test('no online peers', async () => {
      await page.waitFor('[data-test="online-peers-item"]')
      await page.waitFor('[data-test="online-peers-you"]')
      const count = await page.$$eval('[data-test="online-peers-item"]', items => items.length)
      expect(count).toBe(1)
    })

    test('change community title', async () => {
      const newTitle = 'New Title'
      await page.$eval('[data-test="community-name"]', input => input.value = '')
      await page.type('[data-test="community-name"]', newTitle)
      await page.$eval('[data-test="community-name"]', input => input.blur())
      // there is no feedback to user, so wait it out
      await page.waitFor(1000)
      await page.reload({ waitUntil: 'domcontentloaded' })
      await page.waitFor('[data-test="community"]')
      // no actual event to wait for, so wait it out
      await page.waitFor(1000)
      const title = await page.$eval('[data-test="community-name"]', e => e.value)
      expect(title).toBe(newTitle)
    }, 10000)

    test('add publication without customization', async () => {
      expect.assertions(3)
      await page.click('[data-test="community-empty-new"]')
      addPublication({ page, browser })
      await page.waitFor('[data-test="community-grid-wrap-0"]')
      const count = await page.$$eval('[data-test="community-grid-element"]', items => items.length)
      expect(count).toBe(1)
      await checkPublicationMeta({ page, index: 0, caption: '', nickname: newNickname })
    }, 20000)

    test('add a second publication with custom caption', async () => {
      expect.assertions(3)
      await page.click('[data-test="community-new"]')
      addPublication({ page, caption: customCaption })
      await page.waitFor('[data-test="community-grid-wrap-1"]')
      const count = await page.$$eval('[data-test="community-grid-element"]', items => items.length)
      expect(count).toBe(2)
      // publications are sorted by creation date
      // newer publications always get lower numbers
      await checkPublicationMeta({ page, index: 0, caption: customCaption, nickname: newNickname })
    }, 20000)

    test('change publication’s caption & nickname', async () => {
      expect.assertions(2)
      const newNick = 'New Nick'
      const newCaption = 'New Caption'
      await clickOnPublicationByIndex({ page, index: 1 })
      await changePublicationMeta({ page, nickname: newNick, caption: newCaption })
      await page.waitFor(1000)
      await page.reload({ waitUntil: 'domcontentloaded' })
      await page.waitFor('[data-test="community-grid-wrap-1"]')
      await checkPublicationMeta({ page, index: 1, caption: newCaption, nickname: newNick })
    }, 10000)

    test('delete all publications', async () => {
      let number = 2
      while(number > 0) {
        await deletePublication({ page, index: number - 1 })
        number--
      }
      await page.waitFor('[data-test="community-empty"]')
    })

    test('leave community (from community)', async () => {
      await page.click('[data-test="community-leave"]')
      await page.waitFor('[data-test="leave-btn"]')
      await page.click('[data-test="leave-btn"]')
      await page.waitFor('[data-test="communities"]')
    })

    test('404', async () => {
      await page.goto(URL_404, { waitUntil: 'domcontentloaded' })
      await page.waitFor('[data-test="not-found"]')
    })
  })
})
