import { NotImplementedError } from 'common/errors';
import { Page, ElementHandle } from 'puppeteer'
import { Merge } from 'helpers';
import {JobQuery} from './jobquery'

export interface JobSiteOptions {
    actionDelayMS: number;
    capchas: Array<Capcha>
    annoyances: Array<Annoyance>
    jobqueries: Array<JobQuery>
}
export class JobSite{
    static defaultOpts : JobSiteOptions = {actionDelayMS:150,jobqueries:[],annoyances:[],capchas:[]};
    page: Page;
    opts:JobSiteOptions;
    constructor(page: Page,options? : JobSiteOptions) {
        this.opts = Merge(JobSite.defaultOpts,options) as JobSiteOptions
        this.page = page;
    }
    static url: string;
    //static searchBox: { [key: string]: any } = { 'submitXPath': null, 'textBoxXPath': null };
    //static loginForm: { [key: string]: any } = { 'submitXPath': null, 'usernameXPath': null, 'passwordXPath': null }
    async dowork(): Promise<SiteCache> {
        throw new NotImplementedError('dowork is not implemented')
    }
}
export interface SiteCache{
    id: string
    data: any
}

export abstract class SiteDisturbance {
    Detect: (page: Page) => Promise<ElementHandle> = (page: Page) => { throw new NotImplementedError('Detect is not implemented') };
    Handle: (handle: ElementHandle) => Promise<ElementHandle> = (handle: ElementHandle) => { throw new NotImplementedError('Handle is not implemented') };
    constructor(Detect : (page: Page) => Promise<ElementHandle>, Handle : (handle: ElementHandle) => Promise<ElementHandle>) {
        this.Detect = Detect;
        this.Handle = Handle;
    }
    //Detect : CallableFunction
}
export class Capcha extends SiteDisturbance {

}
export class Annoyance extends SiteDisturbance {

}