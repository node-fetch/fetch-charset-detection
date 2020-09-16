import { load } from "cheerio"
import parseContentType from "./parse-content-type"

/**
Get the charset of `content`.
@param content The content to stringify.
@param headers HTTP Headers provided with the request.
*/
function getCharset(content: Buffer, headers?: Headers) {
	// See http://www.w3.org/TR/2011/WD-html5-20110113/parsing.html#determining-the-character-encoding
	// Resulting charset
	let charset: string

	// Try to extract content-type header
	const contentType = headers?.get("content-type")
	if (contentType) {
		charset = parseContentType(contentType)
	}

	// No charset in content type, peek at response body for at most 1024 bytes
	const data = content.slice(0, 1024).toString()

	// HTML5, HTML4 and XML
	if (!charset && data) {
		const $ = load(data)

		charset = parseContentType(
			$("meta[charset]").attr("charset") || // HTML5
			$("meta[http-equiv][content]").attr("content") || // HTML4
			load(data.replace(/<\?(.*)\?>/im, "<$1>"), { xmlMode: true }).root().find("xml").attr("encoding") // XML
		)

		// Prevent decode issues when sites use incorrect encoding
		// ref: https://hsivonen.fi/encoding-menu/
		if (charset && ["gb2312", "gbk"].includes(charset.toLowerCase())) {
			charset = "gb18030"
		}
	}

	return charset || "utf-8"
}

export = getCharset
