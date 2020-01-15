import * as path from 'path';
import * as fs from 'fs';
import { JobQuery } from 'common'
import { mergeDeep, Merge, writeJSON } from 'helpers'
import resourcesConfig from './resources_gatherer'

const configFileName = 'config.json'
let config_path = path.resolve(process.cwd(), configFileName)
console.debug(configFileName + ' path: ' + config_path)
const base_config = {
    'resources': './resources',
    'pappeteer': {
        'plugins': {
            'puppeteer-extra-plugin-stealth': null,
            'puppeteer-extra-plugin-adblocker': { blockTrackers: true }
        },
        'browser_options': {
            'headless': false,
            'timeout': 30 * 1000,
            'userDataDir': 'resources\\profile'
        }
    }
}



let jobbase: JobQuery = {
    query: 'query for evaulation by the site',
    filterKeywords: 'exclude job opportunity based on list of words/strings'.split(' ')
}
function InitDummy(resources: string) {
    writeJSON(path.resolve(resources, 'jobs', 'dummyjob.json.dummy'), jobbase)
}
//the use of relative paths to the scripts is a mess and should change to be based on a common root

//try loading config.json file
let config;
try { config = require(config_path); }
catch (err) { console.warn('Error occured while loading ' + configFileName + ', using defaults') }

//I just want the resource key or val is falsely?, if it doesn't exists use default
let resources; try { resources = config.resources || base_config.resources } catch{ resources = base_config.resources };
let resource_path = path.resolve(process.cwd(), resources);
let [resources_config, gathered]: Array<any> = resourcesConfig(resource_path)

var final_config: any = mergeDeep(base_config, resources_config, config);

if (!fs.existsSync(config_path)) {
    //config does not exist
    InitDummy(resources)
}
writeJSON(config_path, final_config)
export { gathered as resources }
export { config as config }
export default { final_config }
//export {final_config as config}
//export default final_config
