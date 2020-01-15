export * from './errors';
export * from './jobsite';
export * from './jobquery';
export * from './joblisting';
export * from 'helpers';
import PuppeteerExtraHelperPlugin from './puppeteer-extensions/helper-injector';
import puppeteer from 'puppeteer-extra'
//Apply Utility plugin
puppeteer.use(PuppeteerExtraHelperPlugin())