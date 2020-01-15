import {} from 'puppeteer'

import { HelperPageAdditions } from './types'

declare module 'puppeteer' {
  interface Page extends HelperPageAdditions {}
  //interface Frame extends AutoFindJobPageAdditions {}
}

declare module 'puppeteer-core' {
  interface Page extends HelperPageAdditions {}
  //interface Frame extends AutoFindJobPageAdditions {}
}