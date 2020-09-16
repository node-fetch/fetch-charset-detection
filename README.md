# fetch-charset-detection [![Travis CI Build Status](https://img.shields.io/travis/com/Richienb/fetch-charset-detection/master.svg?style=for-the-badge)](https://travis-ci.com/Richienb/fetch-charset-detection)

Detect the encoding of a buffer and stringify it. Originally from [node-fetch](https://github.com/node-fetch/node-fetch).

## Install

```sh
npm install fetch-charset-detection
```

## Usage

```js
const convertBody = require("fetch-charset-detection")

convertBody(content)
```

## API

### convertBody(content, headers?)

#### content

Type: `Buffer`

The content to stringify.

#### headers

Type: [`Headers`](https://developer.mozilla.org/en-US/docs/Web/API/Headers)

The HTTP headers provided with the content.
