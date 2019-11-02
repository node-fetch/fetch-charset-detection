import { Writable } from "stream"
import { isBlob } from "../utils/is"

/**
 * Write a Body to a Node.js WritableStream (e.g. http.Request) object.
 *
 * @param body Body object from the Body instance.
 * @param dest The stream to write to.
 */
export function writeToStream(body: any, dest: Writable): void {
    // Body is null
    if (body == null) dest.end()

    // Body is Blob
    else if (isBlob(body)) body.stream().pipe(dest)

    // Body is buffer
    else if (Buffer.isBuffer(body)) {
        dest.write(body)
        dest.end()
    } else {
        // Body is stream
        body.pipe(dest)
    }
}
