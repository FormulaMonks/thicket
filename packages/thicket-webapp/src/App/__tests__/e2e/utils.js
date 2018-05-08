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

export const checkPublicationMeta = async ({ page, index, nickname, caption }) => {
  const nick = await page.$eval(`[data-test="community-grid-meta-${index}"] [data-test="community-grid-nickname"]`, e => e.innerHTML)
  const cap = await page.$eval(`[data-test="community-grid-meta-${index}"] [data-test="community-grid-caption"]`, e => e.innerHTML)
  expect(nick).toBe(nickname)
  expect(cap).toBe(caption)
}
