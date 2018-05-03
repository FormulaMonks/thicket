import getChrome, { close as closeChrome } from './chrome'
import getFirefox, { close as closeFirefox } from './firefox'
import getSafari, { close as closeSafari } from './safari'

const PORT = process.env.PORT || 3000
const URL = `http://localhost:${PORT}`
const URL_COMMUNITIES = `${URL}/#/communities`
const URL_404 = `${URL}/#/404`
const BROWSERS = ['chrome', 'firefox', 'safari']
const browsers = process.env.BROWSER && BROWSERS.includes(process.env.BROWSER)
  ? [process.env.BROWSER]
  : BROWSERS

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

    test('add publication', async () => {
      await page.click('[data-test="community-empty-new"]')
      // TODO
      // figure out how to enable webcam by defult
      if (browser === 'safari') {
        await page.waitFor(100)
        await page.waitFor('.cameraAccess')
        await page.click('.cameraAccess button')
      }
      await page.waitFor('[data-test="camera-btn-capture"]')
      // video takes some time to start playing, not sure if there is an event triggered
      await page.waitFor(100)
      await page.click('[data-test="camera-btn-capture"]')
      await page.waitFor('[data-test="customize"]')
      await page.click('[data-test="customize-submit"]')
      await page.waitFor('[data-test="community-grid"]')
      const count = await page.$$eval('[data-test="community-grid-element"]', items => items.length)
      expect(count).toBe(1)
    }, 20000)

    test('change publication caption & author', async () => {
      const newAuthor = 'New Author'
      const newCaption = 'New Caption'
      await page.waitFor('[data-test="playable-gif-link"]')
      await page.click('[data-test="playable-gif-link"]')
      await page.waitFor('[data-test="publication-modal"]')
      await page.click('[data-test="gif-created-by"] [data-test="editable-edit"]')
      await page.waitFor('[data-test="gif-created-by"] [data-test="editable-input"]')
      await page.$eval('[data-test="gif-created-by"] [data-test="editable-input"]', input => input.value = '')
      await page.type('[data-test="gif-created-by"] [data-test="editable-input"]', newAuthor)
      await page.click('[data-test="gif-caption"] [data-test="editable-edit"]')
      await page.waitFor('[data-test="gif-caption"] [data-test="editable-input"]')
      await page.$eval('[data-test="gif-caption"] [data-test="editable-input"]', input => input.value = '')
      await page.type('[data-test="gif-caption"] [data-test="editable-input"]', newCaption)
      await page.click('[data-test="publication-save"]')
      await page.waitFor(1000)
      await page.reload({ waitUntil: 'domcontentloaded' })
      await page.waitFor('[data-test="community-grid-element"]')
      const nickname = await page.$eval('[data-test="community-grid-nickname"]', e => e.innerHTML)
      const caption = await page.$eval('[data-test="community-grid-caption"]', e => e.innerHTML)
      expect(nickname).toBe(newAuthor)
      expect(caption).toBe(newCaption)
    }, 10000)

    test('delete publication', async () => {
      await page.waitFor('[data-test="playable-gif-link"]')
      await page.click('[data-test="playable-gif-link"]')
      await page.waitFor('[data-test="publication-modal"]')
      await page.click('[data-test="publication-delete"]')
      await page.waitFor('[data-test="delete-confirm"]')
      await page.click('[data-test="delete-confirm"]')
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
