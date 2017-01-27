# cookie-screener

[![NPM Version][npm-image]][npmjs-url]
[![NPM Downloads][downloads-image]][npmjs-url]
[![Node.js Version][node-version-image]][node-version-url]
[![Build Status][travis-image]][travis-url]

Screen `req.cookies` with `whitelist`, `blacklist`, and `interface` mode

## Installation

```sh
$ npm install cookie-screener
```

## API

```js
var express = require('express');
var cookieParser = require('cookie-parser');
var cookieScreener = require('cookie-screener');

var app = express();
app.use(cookieParser());
app.use(cookieScreener());
```

### cookieScreener(options)

#### options
- `mode`: {String} `whitelist` | `blacklist` | `interface` 
- `list`: {String|Array(String)} keys to whitelist or blacklist
- `interface`: {Object}
  - value is `null`, use value from `req.cookies` with same key
  - value is `?`, use value from `req.query` with same key
  - value is `?name`, use value from `req.query[name]`
  - value is `:`, use value from `req.params` with same key
  - value is `:name`, use value from `req.params[name]`
  - value is `:num`, use value from `req.query[name]`
  - value is `@`, use value from `req.body` with same key
  - value is `@name`, use value from `req.body[name]`
  - value is `*`, use value from `process.env` with same key
  - value is `*name`, use value from `process.env[name]`

## Example

```js
process.env.YEAR = '2017';
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cookieScreener = require('cookie-screener');

var app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/:month', cookieScreener({
    mode: 'interface',
    interface: {
        year: '*YEAR',
        month: ':',
        day: '?d',
        sec: '#second',
        id: '@ID'
    }
}));

app.post('/:month', function (req, res) {
    
    //  curl http://127.0.0.1:8080/01?d=27 --cookie "second=59;" -H "Content-Type: application/json" -X POST -d '{"ID" : "ABCD"}'
    
    console.log(JSON.stringify(req.cookies, null, 2));
    // {
    //     "year": "2017",
    //     "month": "01",
    //     "day": "27",
    //     "sec": "59",
    //     "id": "ABCD"
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
