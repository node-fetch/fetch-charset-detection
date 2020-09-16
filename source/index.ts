import getCharset from "./utils/get-charset"
import { decode } from "iconv-lite"

/**
Detect the encoding of a buffer and stringify it.
@param content The content to stringify.
@param headers The HTTP headers provided with the content.
*/
function convertBody(content: Buffer, headers?: Headers): string {
	// Turn raw buffers into a single utf-8 buffer
	return decode(
		content,
		getCharset(content, headers)
	)
}

export = convertBody
