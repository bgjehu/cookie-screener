/*!
 * cookie-screener
 * Copyright(c) 2017 Jay Hu
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 * @private
 */

const _ = require('lodash');

/**
 * Screen `req.cookies` with white list or black list
 *
 * @param {Object} [req] A http request object
 * @param {String|Array} [list] One or more item that should be white listed or black listed for `req.cookies`, it is [] by default
 * @param {Boolean} [isWhiteList] use true for white list mode and false for black list mode
 * @return {Object} A cookies object with key value pairs
 * @private
 */

const screenWithList = (req, list = [], isWhiteList) => {

    //  if white list, start with empty object, otherwise, start with deepCopy of cookies
    const cookies = req.cookies;
    const _cookies = isWhiteList ? {} : _.cloneDeep(cookies);
    const screenWithString = (key, isWhiteList) => {
        if (isWhiteList) {

            //  if white list, copy over if defined
            const value = cookies[key];
            if (typeof value === 'string') {
                _cookies[key] = value;
            }
        } else {

            //  if black list, remove
            delete _cookies[key];
        }
    };

    /* istanbul ignore else: for list is [] by default */
    if (Array.isArray(list)) {

        //  list is an array, iterate
        list.map((key) => {
            screenWithString(key, isWhiteList);
        });

    } else if (typeof list === 'string') {

        /* istanbul ignore else: for doing nothing on else is fine */
        if (list.length > 0) {
            screenWithString(list, isWhiteList);
        }
    }
    return _cookies;
};

/**
 * Screen `req.cookies` with interface
 *
 * @param {Object} [req] A http request object
 * @param {Object} [_interface] it is {} by default
 * @return {Object} A cookies object with key value pairs
 * @private
 */

const screenWithInterface = (req, _interface = {}) => {
    const resolveValue = (req, key, value) => {
        if (typeof value === 'string') {
            if (value.length > 0) {
                const head = value[0], rest = value.slice(-(value.length - 1));
                if (head === '?') {
                    return (req.query)[head === rest ? key : rest];
                } else if (head === ':') {
                    return (req.params)[head === rest ? key : rest];
                } else if (head === '@') {
                    return (req.body /* istanbul ignore next */ || {})[head === rest ? key : rest];
                } else if (head === '#') {
                    return (req.cookies /* istanbul ignore next */ || {})[head === rest ? key : rest];
                } else if (head === '*') {
                    return (process.env)[head === rest ? key : rest];
                } else {
                    return value;
                }
            } else {
                return '';
            }
        } else if (typeof value === 'number') {
            return value + '';
        }
        return undefined;
    };

    var key, value, cookies = {};
    for(key in _interface) {
        value = resolveValue(req, key, _interface[key]);
        if (typeof value === 'string') {
            cookies[key] = value;
        }
    }

    return cookies;
};

/**
 * Screen `req.cookies` with options
 *
 * @param {Object} [options] it is {} by default
 * @return {Object} A screened cookies object with key value pairs
 * @public
 */

const cookieScreener = (options = {}) => {
    return function (req, res, next) {
        /* istanbul ignore else: for doing nothing is perfectly fine in else clause */
        if (req.cookies) {
            const mode = options.mode;
            const list = options.list;
            const _interface = options.interface;

            /* istanbul ignore else: for doing nothing is perfectly fine in else clause */
            if (mode) { //  mode is defined
                const mode_normalized = mode.toLowerCase();  //  normalize mode;

                /* istanbul ignore else: for doing nothing is perfectly fine in else clause */
                if (mode_normalized === 'whitelist') {
                    req.cookies = screenWithList(req, list, true);
                } else if (mode_normalized === 'blacklist') {
                    req.cookies = screenWithList(req, list);
                } else if (mode_normalized === 'interface') {
                    req.cookies = screenWithInterface(req, _interface);
                }
            }
        }
        next();
    };
};

/**
 * Module exports.
 * @public
 */

module.exports = cookieScreener;