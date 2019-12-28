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

import getCharset from "./utils/get-charset"
import { decode } from "iconv-lite"
import { load as $ } from "cheerio"
import is from "@sindresorhus/is"

/**
* Detect buffer encoding and convert to target encoding
* ref: http://www.w3.org/TR/2011/WD-html5-20110113/parsing.html#determining-the-character-encoding
*
* @param content The content to convert.
* @param headers HTTP Headers provided with a request.
*/
export default function convertBody(content: Buffer | string, headers?: Headers): string {
    // Try to extract content-type header
    const contentType = !is.nullOrUndefined(headers) ? headers.get("content-type") : null

    // Resulting charset
    let charset: string

    // Convert to buffer
    if (is.string(content)) content = Buffer.from(content)

    // Header
    if (contentType) charset = getCharset(contentType)

    // No charset in content type, peek at response body for at most 1024 bytes
    const res = content.slice(0, 1024).toString()

    // HTML5, HTML4 and XML
    if (!charset && res) {
        charset = getCharset(
            $(res)("meta[charset]").attr("charset") || // HTML5
            $(res)("meta[http-equiv][content]").attr("content") || // HTML4
            $(res.replace(/<\?(.*)\?>/im, "<$1>"), { xmlMode: true }).root().find("xml").attr("encoding"), // XML
        )
    }

    // Prevent decode issues when sites use incorrect encoding
    // ref: https://hsivonen.fi/encoding-menu/
    if (charset && ["gb2312", "gbk"].includes(charset.toLowerCase())) charset = "gb18030"

    // Turn raw buffers into a single utf-8 buffer
    return decode(
        content,
        charset || "utf-8",
    )
}

module.exports = convertBody
