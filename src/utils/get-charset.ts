import { parse as parseContentType } from "content-type"
import _ from "lodash"

/**
 * Get the character set from a Content-Type header.
 * @param contentType The Content-Type HTTP header.
 */
export default function getCharSet(contentType: string): string | null {
    return !_.isNil(contentType) ? parseContentType(contentType).parameters.charset : null
}
