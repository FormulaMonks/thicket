import webdriver from 'selenium-webdriver'
import firefox from 'selenium-webdriver/firefox'
import mixin from 'selenium-dom'
import { helper } from './utils'

let driver

export const close = () => driver.close()

export default async () => {
  mixin(webdriver)
  driver = await new webdriver.Builder()
    .forBrowser('safari')
    .build()
  await driver.manage().window().maximize()
  return helper(driver)
}
