import { ElementHandle, Page, Timeoutable } from "puppeteer"
import { Merge } from ".";
import { TimeoutPromise } from "./promise-helpers";

const default_timeout = 30000
let TimeoutableDefault : Timeoutable = {timeout:default_timeout};
/**
 * gets the innerText of an element handle
 * 
 * @param handle 
 */
export async function innerText(handle: ElementHandle) : Promise<string> {
    return await handle.evaluate((el: HTMLElement) => el.innerText)
}
/**
 * gets the textContent of an element handle
 * 
 * @param handle 
 */
export async function textContent (handle: ElementHandle) : Promise<string> {
    return await handle.evaluate((el: HTMLElement) => el.textContent)
}
/**
 * gets the value of an element handle
 * 
 * @param handle 
 */
export async function value(handle : ElementHandle) : Promise<string>{
    return  await handle.evaluate((el: HTMLInputElement) => el.value)
}
/**
 * attempts to delete a line
 * 
 * @param handle 
 */
export async function clearLinePage(page : Page)  {
    await page.keyboard.press('Home');
    await page.keyboard.down('Shift');
    await page.keyboard.press('End');
    await page.keyboard.up('Shift');
    await page.keyboard.press('Backspace');
}
/**
 * attempts to clear textbox/input
 * 
 * @param handle 
 * @param [options] timeout in ms, default 30000ms
 */
export async function clearInput(handle:ElementHandle, options? : Timeoutable) {
    options = Merge(TimeoutableDefault,options)
    let text = await value(handle)
    let overtime = false
    let callback = ()=>{
        overtime=true
    }
    TimeoutPromise(options.timeout,callback)
    while (text != '' && !overtime) {
        await handle.click();
        await handle.press("Backspace");
        text = await value(handle);
    }
    return text;
}
/**
 * attempts to type to handle
 * 
 * @param handle 
 * @param string
 * @param [options] timeout in ms, default 30000ms
 */
export async function validateTyping(handle : ElementHandle, input :string, options?: Timeoutable){
    options = Merge(TimeoutableDefault,options)
    let val = await value(handle)
    let overtime = false
    let callback = ()=>{
        overtime=true
    }
    TimeoutPromise(options.timeout,callback)
    while(val != input && !overtime){
        await clearInput(handle,options)
        await handle.type(input)
        val = await value(handle)
    }
    return val;

}