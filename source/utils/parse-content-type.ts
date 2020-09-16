import { parse } from "content-type"

/**
Get the character set from a Content-Type header.
@param contentType The Content-Type HTTP header.
*/
function parseContentType(contentType: string) {
	try {
		return parse(contentType).parameters.charset
	} catch (_) {
		return contentType
	}
}

export = parseContentType
