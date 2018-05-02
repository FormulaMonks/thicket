import webdriver from 'selenium-webdriver'
import firefox from 'selenium-webdriver/firefox'
import mixin from 'selenium-dom'
import { helper } from './utils'

let driver

export const close = () => driver.close()

export default async () => {
  mixin(webdriver)
  const opts = new firefox.Options()
  if (process.env.HEADLESS !== 'false') {
    opts.headless()
  }
  opts.setPreference('media.navigator.permission.disabled', true)

  driver = await new webdriver.Builder()
    .forBrowser('firefox')
    .setFirefoxOptions(opts)
    .build()
  return helper(driver)
}
