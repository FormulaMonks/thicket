import puppeteer from 'puppeteer'

let driver

export const close = () => driver.close()

export default async () => {
  driver = await puppeteer.launch({
    headless: process.env.HEADLESS !== 'false',
    args: ['--use-fake-ui-for-media-stream']
  })
  const page = await driver.newPage()
  // set dimensions to full browser screen with experimental feature:
  await page._client.send('Emulation.clearDeviceMetricsOverride')
  return page
}
