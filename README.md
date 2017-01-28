# cookie-screener

[![NPM Version][npm-image]][npmjs-url]
[![NPM Downloads][downloads-image]][npmjs-url]
[![Node.js Version][node-version-image]][node-version-url]
[![Build Status][travis-image]][travis-url]
[![Codacy Badge](https://api.codacy.com/project/badge/Coverage/895ba3cda0954f019f1b6e85af51dd8a)](https://www.codacy.com/app/bgjehu/cookie-screener?utm_source=github.com&utm_medium=referral&utm_content=bgjehu/cookie-screener&utm_campaign=Badge_Coverage)

Screen `req.cookies` with `whitelist` or `blacklist` mode

## Installation

```sh
$ npm install cookie-screener
```

## API

```js
const express = require('express');
const cookieParser = require('cookie-parser');
const cookieScreener = require('cookie-screener');

const app = express();
app.use(cookieParser());
app.use(cookieScreener({
    mode: 'whitelist', list: ['foo', 'bar']
}));
```

### cookieScreener(options)

#### options
- `mode`: {string} `'whitelist'` | `'blacklist'` 
- `list`: {string | array<string>} keys to whitelist or blacklist

## Example

```js
const express = require('express');
const cookieParser = require('cookie-parser');
const cookieScreener = require('./index');

const app = express();
app.use(cookieParser());
app.use(cookieScreener({
    mode: 'whitelist', list: ['foo', 'bar']
}));

app.post('/', function (req, res) {

    //  curl http://127.0.0.1:8080 --cookie "foo=foo;bar=bar;zen=zne" -X POST

    console.log(JSON.stringify(req.cookies, null, 2));
    res.send(req.cookies);
    // {
    //     "foo": "foo",
    //     "bar": "bar"
    // }
});

app.listen(8080);
```

### [MIT Licensed](LICENSE)

[npm-image]: https://img.shields.io/npm/v/cookie-screener.svg
[npmjs-url]: https://npmjs.org/package/cookie-screener
[downloads-image]: https://img.shields.io/npm/dm/cookie-screener.svg
[node-version-image]: https://img.shields.io/node/v/cookie-screener.svg
[node-version-url]: https://nodejs.org/en/download
[travis-image]: https://img.shields.io/travis/bgjehu/cookie-screener/master.svg
[travis-url]: https://travis-ci.org/bgjehu/cookie-screener
