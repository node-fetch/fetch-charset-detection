import { parse as parseContentType } from "content-type"

/**
 * Get the character set from a Content-Type header.
 * @param contentType The Content-Type HTTP header.
 */
export default function getCharSet(contentType: string): string | null {
    return contentType != null ? parseContentType(contentType).parameters.charset : null
}
