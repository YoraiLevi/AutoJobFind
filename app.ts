import { Browser } from "puppeteer";
import { TimeoutPromise, JobQuery, JobSite, JobSiteOptions, Merge, writeJSON,loadJSONSync } from "common";
import path from 'path'
//import './config';
const config = require('configuration').config;
const resources = require('configuration').resources;
const puppeteer = require('puppeteer-extra')

async function work() {
    let cache_path = path.resolve(config.resources,'cache.json')
    //let caches = loadJSONSync(cache_path)
    let promises = []
    try {
        let siteKeys: Array<string> = Object.keys(resources.sites)
        console.info(siteKeys.length, 'site(s) were detected')
        for (let key of siteKeys) {
            let prototype = resources.sites[key]
            let page = await browser.newPage()
            try {
                let configA: JobSiteOptions = prototype.defaultOpts;
                configA.jobqueries = getJobQueries(key)
                let configB = config.sites[key];
                let configFinal = Merge(configA, configB);
                let site = new prototype(page, configFinal)
                //await site.dowork()
                promises.push(site.dowork())
            }
            catch (err) { console.warn(err) }
        }
        await Promise.all(promises).then((results:Array<object>)=>{writeJSON(cache_path,results)}).catch()
        console.info("Work done!")
    }
    catch (err) {
        console.error('Error occured while attemping to perform work.')
        console.error(err)
    }
}

let jobsNames: Array<string> = Object.keys(config.jobs)
function getJobQueries(key: string) {
    return jobsNames.map(
        (jobName: string) => {
            let jobconfig = config.jobs[jobName];
            if (jobconfig
                && (typeof (jobconfig) == 'boolean' && jobconfig
                    || (typeof (jobconfig) == 'object' && jobconfig.includes(key))
                )
            ) return resources.jobs[jobName];
        }).filter(x => x)
}

async function main() {
    try {
        await init()
        let tiredOfErrorsOfInitialization = TimeoutPromise(3000)
        await work()
        await tiredOfErrorsOfInitialization;
    }
    finally {
        await teardown()
    }
}
var browser: Browser;
async function init() {
    let plugins = config.pappeteer.plugins;
    for (let plugin in plugins) {
        let args = plugins[plugin]
        puppeteer.use(require(plugin)(args))
    }
    let browser_options = config.pappeteer.browser_options;
    browser = await puppeteer.launch(browser_options)
    let page0 = (await browser.pages())[0]
    new Promise((resolve, reject) => { setTimeout(() => { console.warn("Attempting to close initial tab, browser will shutdown if no tabs are available"); resolve(page0.close()); }, 2000) })

}
async function teardown() {
    try {
        await browser.close()
    }
    catch (err) {
        console.error('Error closing browser')
        //if browser was even init then report the error, this spam was annoying when debugging
        if (browser) console.error(err);
    }
}
main()