import { isBlob } from "../utils/is"
import _ from "lodash"

/**
 * The Fetch Standard treats this as if "total bytes" is a property on the body.
 * For us, we have to explicitly get it with a function.
 *
 * ref: https://fetch.spec.whatwg.org/#concept-body-total-bytes
 *
 * @param body Body object from the Body instance.
 */
export function getTotalBytes({ body }: { body: any }): number | null {
    // Body is null or undefined
    if (body == null) return 0

    // Body is Blob
    if (isBlob(body)) return body.size

    // Body is Buffer
    if (Buffer.isBuffer(body)) return body.length

    // Detect form data input from form-data module
    if (body && _.isFunction(body.getLengthSync)) return body.hasKnownLength && body.hasKnownLength() ? body.getLengthSync() : null

    // Body is stream
    return null
}
