/**
 * Promise that resolves after a given period.
 * @param ms preiod in ms
 * @param callback to execute
 */
export function TimeoutPromise(ms: number, callback: CallableFunction = () => { }): Promise<void> {
    return new Promise((resolve, reject) => { setTimeout(() => { callback(); resolve(); }, ms) })
}