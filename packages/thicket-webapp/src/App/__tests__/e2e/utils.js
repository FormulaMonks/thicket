import webdriver from 'selenium-webdriver'

const { By, until } = webdriver

const sleep = t => new Promise(r => setTimeout(r, t))

const funcs = ['blur', 'focus']

const proxiedWebElement  = ({ d, e, s }) => new Proxy({}, {
  get: (t, p) => {
    if (funcs.includes(p)) {
      return () => {
        d.executeScript(`document.querySelector('${s}')['${p}']()`)
      }
    }
    return e.getAttribute(p)
  },
  set: async (o, p, v) => {
    return await d.executeScript(`document.querySelector('${s}').value='${v}'`)
  }
})

// this helper is used to emulate puppeteer's interface, if things fail with new
// tests pelase review that the method passthrough is working correctly
export const helper = d => ({
  ['$eval']: async (s, cb) => {
    const e = await d.findElement(By.css(s))
    return cb(proxiedWebElement({ d, e, s }))
  },
  ['$$eval']: async (s, cb) => {
    return cb(await d.querySelectorAll(s))
  },
  click: async s => {
    return await d.findElement(By.css(s)).click()
  },
  close: async () => {
    return await d.quit()
  },
  goto: async u => {
    return await d.navigate().to(u)
  },
  reload: async () => {
    return await d.navigate().refresh()
  },
  type: async (s, v) => {
    return await d.findElement(By.css(s)).sendKeys(v)
  },
  waitFor: async s => {
    if (typeof s === 'number') {
      return sleep(s)
    }
    return await d.wait(until.elementLocated(By.css(s)))
  }
})

export const addPublication = async ({ page, browser, caption, nickname }) => {
  // TODO
  // figure out how to enable webcam by defult
  if (browser === 'safari') {
    await page.waitFor(500)
    await page.waitFor('.cameraAccess')
    await page.click('.cameraAccess button')
  }
  await page.waitFor('[data-test="camera-btn-capture"]')
  // video takes some time to start playing, not sure if there is an event triggered
  await page.waitFor(500)
  await page.click('[data-test="camera-btn-capture"]')
  await page.waitFor('[data-test="customize"]')
  if (caption) {
    await page.type('[data-test="customize-caption"]', caption)
  }
  if (nickname) {
    await page.type('[data-test="customize-nickname"]', nickname)
  }
  await page.click('[data-test="customize-submit"]')
}

export const changeProfileNickname = async ({ page, newNickname }) => {
  await page.click('[data-test="profile-link"]')
  await page.waitFor('[data-test="profile"]')
  await page.$eval('[data-test="profile-input"]', input => input.value = '')
  await page.type('[data-test="profile-input"]', newNickname)
  await page.click('[data-test="profile-save"]')
}

export const changePublicationMeta = async ({ page, caption, nickname }) => {
  await page.waitFor('[data-test="publication-modal"]')
  await page.waitFor(1000)
  if (nickname) {
    await page.click('[data-test="gif-created-by"] [data-test="editable-edit"]')
    await page.waitFor('[data-test="gif-created-by"] [data-test="editable-input"]')
    await page.$eval('[data-test="gif-created-by"] [data-test="editable-input"]', input => input.value = '')
    await page.type('[data-test="gif-created-by"] [data-test="editable-input"]', nickname)
  }
  if (caption) {
    await page.click('[data-test="gif-caption"] [data-test="editable-edit"]')
    await page.waitFor('[data-test="gif-caption"] [data-test="editable-input"]')
    await page.$eval('[data-test="gif-caption"] [data-test="editable-input"]', input => input.value = '')
    await page.type('[data-test="gif-caption"] [data-test="editable-input"]', caption)
    await page.click('[data-test="publication-save"]')
  }
}

export const checkPublicationMeta = async ({ page, index, nickname, caption }) => {
  const nick = await page.$eval(`[data-test="community-grid-meta-${index}"] [data-test="community-grid-nickname"]`, e => e.innerHTML)
  const cap = await page.$eval(`[data-test="community-grid-meta-${index}"] [data-test="community-grid-caption"]`, e => e.innerHTML)
  expect(nick).toBe(nickname)
  expect(cap).toBe(caption)
}

export const clickOnPublicationByIndex = async ({ page, index }) => {
  const paused = await page.$$eval(`[data-test="community-grid-wrap-${index}"] [data-test="gif-paused"]`, e => e.length)
  if (paused) {
    await page.click(`[data-test="community-grid-wrap-${index}"] .play_button`)
  }
  await page.waitFor(500)
  await page.click(`[data-test="community-grid-wrap-${index}"] [data-test="playable-gif-link"]`)
}

export const deletePublication = async ({ page, index }) => {
  await clickOnPublicationByIndex({ page, index })
  await page.waitFor('[data-test="publication-modal"]')
  await page.click('[data-test="publication-delete"]')
  await page.waitFor('[data-test="delete-confirm"]')
  await page.click('[data-test="delete-confirm"]')
}
