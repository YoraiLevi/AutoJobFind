/// <reference path="./puppeteer-mods.d.ts" />
// Warn: The above is EXTREMELY important for our custom page mods to be recognized by the end users typescript!

/**
 * Extend window object with recaptcha things
 */
import { Timeoutable, ElementHandle, WaitForGUISelectorOptions } from 'puppeteer';
declare module 'puppeteer' {
  export interface WaitForGUISelectorOptions extends Timeoutable {
  }
}
export type HelperPageAdditions = {
  $allFrames(selector: string): Promise<ElementHandle>;
  waitForGUISelector(selector: string, options?: WaitForGUISelectorOptions): Promise<ElementHandle>
}
export interface PluginOptions {
}