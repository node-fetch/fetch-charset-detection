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
function convertBody(content: Buffer | string, headers?: Headers): string {
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

export = convertBody
