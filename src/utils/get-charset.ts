import { parse as parseContentType } from "content-type"
import is from "@sindresorhus/is"
import niceTry from "nice-try"

/**
 * Get the character set from a Content-Type header.
 * @param contentType The Content-Type HTTP header.
 */
export = (contentType: string): string | null => {
	if (is.nullOrUndefined(contentType)) return null

	const parsed = niceTry(() => parseContentType(contentType))
	if (!is.nullOrUndefined(parsed)) return parsed.parameters.charset
	else return contentType
}
