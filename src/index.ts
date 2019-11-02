/**
 * @license
 *
 * MIT License
 *
 * Copyright (c) 2019 Richie Bendall and 2016 - 2019 The Node Fetch Team
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the 'Software'), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { decode as convert } from "iconv-lite"
import getCharSet from "./utils/getCharSet"
import { load as $ } from "cheerio"
import { isURLSearchParams, isBlob, isArrayBuffer } from "./utils/is"
import { Stream, Writable } from "stream"

/**
* Detect buffer encoding and convert to target encoding
* ref: http://www.w3.org/TR/2011/WD-html5-20110113/parsing.html#determining-the-character-encoding
*
* @param buffer Incoming buffer.
* @param headers Headers provided with the request.
*/
export function convertBody(buffer: Buffer, headers?: Headers): string {
    const contentType = headers instanceof Headers ? headers.get("content-type") : null
    let charset: string

    // Header
    if (contentType) charset = getCharSet(contentType)

    // No charset in content type, peek at response body for at most 1024 bytes
    const res = buffer.slice(0, 1024).toString()

    // HTML5, HTML4 and XML
    if (!charset && res) {
        charset = getCharSet(
            $(res)("meta[charset]").attr("charset") || // HTML5
            $(res)("meta[http-equiv][content]").attr("content") || // HTML4
            $(res.replace(/<\?(.*)\?>/im, "<$1>"), { xmlMode: true }).root().find("xml").attr("encoding") // XML
        )
    }

    // Prevent decode issues when sites use incorrect encoding
    // ref: https://hsivonen.fi/encoding-menu/
    if (charset && charset.toLowerCase() in ["gb2312", "gbk"]) charset = "gb18030"

    // Turn raw buffers into a single utf-8 buffer
    return convert(
        buffer,
        charset || "utf-8"
    )
}

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

/**
 * The Fetch Standard treats this as if "total bytes" is a property on the body.
 * For us, we have to explicitly get it with a function.
 *
 * ref: https://fetch.spec.whatwg.org/#concept-body-total-bytes
 *
 * @param body Body object from the Body instance.
 */
export function getTotalBytes(body: any): number | null {
    // Body is null or undefined
    if (body == null) return 0

    // Body is Blob
    if (isBlob(body)) return body.size

    // Body is Buffer
    if (Buffer.isBuffer(body)) return body.length

    // Detect form data input from form-data module
    if (body && typeof body.getLengthSync === "function") return body.hasKnownLength && body.hasKnownLength() ? body.getLengthSync() : null

    // Body is stream
    return null
}

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
