import {parse} from "content-type"
import niceTry from "nice-try"

/**
Get the character set from a Content-Type header.
@param contentType The Content-Type HTTP header.
*/
function parseContentType(contentType: string) {
	return niceTry(() => parse(contentType))?.parameters?.charset ?? contentType
}

export = parseContentType
