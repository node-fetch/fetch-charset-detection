import { Stream } from "stream"
import { isBlob, isURLSearchParams, isArrayBuffer } from "../utils/is"

/**
 * Performs the operation "extract a `Content-Type` value from |object|" as
 * specified in the specification:
 * https://fetch.spec.whatwg.org/#concept-bodyinit-extract
 *
 * This function assumes that instance.body is present.
 *
 * @param body Any options.body input
 */
export function extractContentType(body: any): string | null {
    // Body is string
    if (typeof body === "string") return "text/plain;charset=UTF-8"

    // Body is a URLSearchParams
    if (isURLSearchParams(body)) return "application/x-www-form-urlencoded;charset=UTF-8"

    // Body is blob
    if (isBlob(body)) return body.type || null

    // Body is a Buffer (Buffer, ArrayBuffer or ArrayBufferView)
    if (Buffer.isBuffer(body) || isArrayBuffer(body) || ArrayBuffer.isView(body)) return null

    // Detect form data input from form-data module
    if (typeof body.getBoundary === "function") return `multipart/form-data;boundary=${body.getBoundary()}`

    // Body is stream - can't really do much about this
    if (body instanceof Stream) return null

    // Body constructor defaults other things to string
    return "text/plain;charset=UTF-8"
}
