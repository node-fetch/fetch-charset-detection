import _ from "lodash"

const NAME = Symbol.toStringTag

/**
 * Check if `obj` is a URLSearchParams object
 * ref: https://github.com/bitinn/node-fetch/issues/296#issuecomment-307598143
 *
 * @param obj The object to check.
 */
export function isURLSearchParams(obj: any): obj is URLSearchParams {
    return (
        !_.isNil(obj) &&
        _.isFunction(obj.append) &&
        _.isFunction(obj.delete) &&
        _.isFunction(obj.get) &&
        _.isFunction(obj.getAll) &&
        _.isFunction(obj.has) &&
        _.isFunction(obj.set) &&
        _.isFunction(obj.sort) &&
        obj[NAME] === "URLSearchParams"
    )
}

declare interface FetchBlob extends Blob {
    arrayBuffer: Function,
    type: string,
    stream: Function,
    constructor: Function
}

/**
 * Check if `obj` is a W3C `Blob` object (which `File` inherits from)
 *
 * @param obj The object to check.
 */
export function isBlob(obj: any): obj is FetchBlob {
    return (
        !_.isNil(obj) &&
        _.isFunction(obj.arrayBuffer) &&
        _.isString(obj.type) &&
        _.isFunction(obj.stream) &&
        _.isFunction(obj.constructor) &&
        /^(Blob|File)$/.test(obj[NAME])
    )
}

/**
 * Check if `obj` is an instance of AbortSignal.
 *
 * @param obj The object to check.
 */
export function isAbortSignal(obj: any): obj is AbortSignal {
    return (
        _.isObject(obj) &&
        obj[NAME] === "AbortSignal"
    )
}

/**
 * Check if `obj` is an instance of ArrayBuffer.
 *
 * @param obj The object to check.
 */
export function isArrayBuffer(obj: any): obj is ArrayBuffer {
    return (
        _.isObject(obj) &&
        obj[NAME] === "ArrayBuffer"
    )
}

declare class AbortError extends Error {
    name: "AbortError";
    [Symbol.toStringTag]: "AbortError";
    constructor(message: string);
    type: string;
    message: string
}

/**
 * Check if `obj` is an instance of AbortError.
 *
 * @param obj The object to check.
 */
export function isAbortError(obj: any): obj is AbortError {
    return obj[NAME] === "AbortError"
}
