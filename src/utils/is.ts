const NAME = Symbol.toStringTag;

/**
 * Check if `obj` is a URLSearchParams object
 * ref: https://github.com/bitinn/node-fetch/issues/296#issuecomment-307598143
 *
 * @param obj The object to check.
 */
export function isURLSearchParams(obj: any): obj is URLSearchParams {
    return (
        typeof obj === 'object' &&
        typeof obj.append === 'function' &&
        typeof obj.delete === 'function' &&
        typeof obj.get === 'function' &&
        typeof obj.getAll === 'function' &&
        typeof obj.has === 'function' &&
        typeof obj.set === 'function' &&
        typeof obj.sort === 'function' &&
        obj[NAME] === 'URLSearchParams'
    );
}

interface FetchBlob extends Blob {
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
        typeof obj === 'object' &&
        typeof obj.arrayBuffer === 'function' &&
        typeof obj.type === 'string' &&
        typeof obj.stream === 'function' &&
        typeof obj.constructor === 'function' &&
        /^(Blob|File)$/.test(obj[NAME])
    );
}

/**
 * Check if `obj` is an instance of AbortSignal.
 *
 * @param obj The object to check.
 */
export function isAbortSignal(obj: any): obj is AbortSignal {
    return (
        typeof obj === 'object' &&
        obj[NAME] === 'AbortSignal'
    );
}

/**
 * Check if `obj` is an instance of ArrayBuffer.
 *
 * @param obj The object to check.
 */
export function isArrayBuffer(obj: any): obj is ArrayBuffer {
    return obj[NAME] === 'ArrayBuffer';
}

interface AbortError extends Error {
    name: "AbortError";
    [Symbol.toStringTag]: "AbortError"
    constructor(message: string);
    type: string;
    message: string;
}

/**
 * Check if `obj` is an instance of AbortError.
 *
 * @param obj The object to check.
 */
export function isAbortError(obj: any): obj is AbortError {
    return obj[NAME] === 'AbortError';
}
