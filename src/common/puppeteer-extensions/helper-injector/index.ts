import { ElementHandle, Page, Browser, WaitForGUISelectorOptions, errors } from 'puppeteer'
import { PuppeteerExtraPlugin } from 'puppeteer-extra-plugin'

import * as types from './types'

/**
 * A puppeteer-extra plugin to extend puppeteer functionality.
 * @noInheritDoc
 */
export class PuppeteerExtraPluginHelper extends PuppeteerExtraPlugin {

  private _addCustomMethods(page: Page) {
    page.waitForGUISelector = async (selector: string, opts: WaitForGUISelectorOptions) => this.waitForGUISelector(page, selector, opts)
    page.$allFrames = async (selector: string) => this.$allFrames(page, selector)
  }

  async onPageCreated(page: Page) {
    this.debug('onPageCreated', page.url())
    // Add custom page methods
    this._addCustomMethods(page)

    // // Add custom methods to potential frames as well
    // page.on('frameattached', frame => {
    //   if (!frame) return
    //   this._addCustomMethods(frame)
    // })
  }

  /** Add additions to already existing pages and frames */
  async onBrowser(browser: Browser) {
    this.debug('onBrowser')
    const pages = await browser.pages()
    for (const page of pages) {
      this._addCustomMethods(page)
      // for (const frame of page.mainFrame().childFrames()) {
      //   this._addCustomMethods(frame)
      // }
    }
  }


  constructor(opts?: Partial<types.PluginOptions>) {
    super(opts)
    this.debug('Initialized', this.opts)
  }
  get name() {
    return 'autofindjob'
  }
  get defaults(): types.PluginOptions {
    return {};
  }
  async waitForGUISelector(page: Page, selector: string, opts: WaitForGUISelectorOptions): Promise<ElementHandle> {

    let frames = page.frames();
    opts = Object.assign({}, opts, { hidden: false, visible: true })
    let promises = frames.map(frame => { return frame.waitForSelector(selector, opts) })
    let handle = await Promise.race(promises);
    return (handle)//.filter(x => x)[0];
  };
  async $allFrames(page: Page, selector: string) {
    let frames = page.frames();
    let promises: Array<Promise<ElementHandle>> = frames.map(frame => { return frame.$(selector) })
    return (await Promise.all(promises)).filter(x => x)[0];
  };
}
/** Default export, PuppeteerExtraPluginAutoFindJob  */
const defaultExport = (options?: Partial<types.PluginOptions>) => {
  return new PuppeteerExtraPluginHelper(options || {})
}
export default defaultExport
