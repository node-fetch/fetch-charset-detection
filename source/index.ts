import getCharset from "./utils/get-charset"
import {decode} from "iconv-lite"

/**
* Detect buffer encoding and convert to target encoding
* ref: http://www.w3.org/TR/2011/WD-html5-20110113/parsing.html#determining-the-character-encoding
*
* @param content The content to convert.
* @param headers HTTP Headers provided with a request.
*/
function convertBody(content: Buffer, headers?: Headers): string {
	// Turn raw buffers into a single utf-8 buffer
	return decode(
		content,
		getCharset(content, headers),
	)
}

export = convertBody
