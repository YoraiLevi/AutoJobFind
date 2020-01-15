export interface JobQuery {
    query: string;
    filterKeywords: Array<string>;
    options?: {[id:string] : JobQueryOptions}
}
export interface JobQueryOptions{
    
}