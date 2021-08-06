import type {Buffer} from 'node:buffer';
import iconv from 'iconv-lite';
import getCharset from './utils/get-charset.js';

/**
Detect the encoding of a buffer and stringify it.

@param content The content to stringify.
@param headers The HTTP headers provided with the content.

@example
```
import convertBody from 'fetch-charset-detection';

convertBody(content);
```
*/
export default function convertBody(content: Buffer, headers?: Headers): string {
	// Turn raw buffers into a single utf-8 buffer
	return iconv.decode(
		content,
		getCharset(content, headers),
	);
}
