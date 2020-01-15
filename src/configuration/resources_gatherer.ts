import * as path from 'path'
import * as fs from 'fs'
// https://stackoverflow.com/questions/5827612/node-js-fs-readdir-recursive-directory-search
function gatherConfigs(resources) {
    function gather(dir,
        retAction = (ret, dir, item) => { ret[item] = item },
        mergeAction = (prevRet, item, merge) => { prevRet[item] = merge },
        ret = {}
    ) {
        let list = fs.readdirSync(dir);
        list.forEach(item => {
            let item_path = path.resolve(dir, item)
            let stat = fs.statSync(item_path);
            if (stat && stat.isDirectory()) {
                /* Recurse into a subdirectory */
                mergeAction(ret, item, gather(item_path, retAction, mergeAction));
            } else {
                /* Is a file */
                retAction(ret, dir, item)
            }
        })
        return ret;
    }
    let gathered ={}
    let processItem = (dir, item) => {
        let ext = path.extname(item)
        let resource_path = path.resolve(dir, item)
        try{
        if (ext == '.json') {
            let data = require(resource_path);
            return [data, true]; //Assign enabled flag
        }
        if (ext == '.ts' || ext == '.js') {
            let mod = require(resource_path);
            return [mod.default, mod.config];
        } else {
            return;
        }}
        catch(err){
            console.error('Error loading resource at: '+resource_path)
            console.error(err)
        }
    }
    let retAction = (ret, dir, item) => {
        let key = path.basename(item, path.extname(item))
        let dirname = path.basename(dir, path.extname(dir))
        try{//try for returnining undefined
        let [val, config] = processItem(dir, item);
        if(config){ret[key] = config;}//ifconfig exists add it
        if(val){//if val exists add it to gathered resources
        if(!gathered[dirname]){ //folder tree
            gathered[dirname]={}
        }
        gathered[dirname][key]=val}}
        catch(err){}
    }
    return [gather(resources, retAction),gathered]
}
export function resourcesConfig(resources: string) {
    console.info("Gathering external resources...")
    let resource_path = path.resolve(process.cwd(), resources);
    console.log('resource path: ' + resource_path);
    //const config = require(resource_path).config
    const [config,gathered] = gatherConfigs(resources)
    //let out_config = Object.assign(config, in_config);
    return [config,gathered]
}
export default resourcesConfig;