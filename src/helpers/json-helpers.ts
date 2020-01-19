import * as fs from 'fs'
import * as path from 'path'
/**
 * Asynchronously writes object as json 
 * @param fileName name of file (path)
 * @param [json] 
 * @param [indent] 
 */
export async function writeJSON(fileName : string, json = {}, indent = '\t') {
    try{
        var jsonContent = JSON.stringify(json, null, indent);
        let fileDir = path.dirname(fileName)
        await fs.promises.mkdir(fileDir , { recursive: true } )
        await fs.promises.writeFile(fileName, jsonContent, 'utf8')
        console.debug(fileName + " JSON file has been saved.") 
    }
    catch(err){
        console.log(err);
        console.log("An error occured while writing JSON Object to File.");
    }
}
/**
 * Synchronously writes object as json 
 * @param fileName name of file (path)
 * @param [json] 
 * @param [indent] 
 */
export function writeJSONSync(fileName : string, json = {}, indent = '\t') {
    var jsonContent = JSON.stringify(json, null, indent);
    try {
        let fileDir = path.dirname(fileName)
        fs.mkdirSync(fileDir , { recursive: true } )
        fs.writeFileSync(fileName, jsonContent, 'utf8')
        console.debug(fileName + " JSON file has been saved.")
    }
    catch (err) {
        console.warn(err)
        console.warn("An error occured while writing JSON Object to File.")
    }
}

/**
 * Synchronously Loads json file
 * @param fileName name of file (path)
 * @returns  
 */
export function loadJSONSync(fileName: string) {
    try {
        let data = fs.readFileSync(fileName, 'utf8')
        let parsed = JSON.parse(data);
        return parsed;
    }
    catch (err) {
        console.debug("Couldn't load JSON")
        console.error(err)
        throw err;
    }
}