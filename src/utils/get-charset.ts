import { parse as parseContentType } from "content-type"
import _ from "lodash"
import niceTry from "nice-try"

/**
 * Get the character set from a Content-Type header.
 * @param contentType The Content-Type HTTP header.
 * @private
 */
export default function getCharset(contentType: string): string | null {
    if (_.isNil(contentType)) return null

    const parsed = niceTry(() => parseContentType(contentType))
    if (!_.isNil(parsed)) return parsed.parameters.charset
    else return contentType
}
