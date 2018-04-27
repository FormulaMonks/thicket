import puppeteer from 'puppeteer'

const PORT = process.env.PORT || 3000
const URL = `http://localhost:${PORT}`

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
