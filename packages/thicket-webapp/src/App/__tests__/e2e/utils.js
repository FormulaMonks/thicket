import webdriver from 'selenium-webdriver'

const { By, until } = webdriver

const sleep = t => new Promise(r => setTimeout(r, t))

const funcs = ['blur', 'focus']

const attribute  = ({ d, e, s }) => new Proxy({}, {
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
    return cb(attribute({ d, e, s }))
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
