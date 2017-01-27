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
 * @param {Object} [cookies] A cookies object with key value pairs
 * @param {String|Array} [list] One or more item that should be white listed or black listed for `req.cookies`, it is [] by default
 * @param {Boolean} [isWhiteList] use true for white list mode and false for black list mode
 * @return {Object} A cookies object with key value pairs
 * @private
 */

const screenWithList = (cookies, list = [], isWhiteList) => {

    //  if white list, start with empty object, otherwise, start with deepCopy of cookies
    const _cookies = isWhiteList ? {} : _.cloneDeep(cookies);
    const screenWithString = (key) => {
        if (isWhiteList) {

            //  if white list, copy over
            const value = cookies[key];
            if (value !== undefined) {
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
            screenWithString(key);
        });

    } else if (typeof list === 'string') {

        /* istanbul ignore else: for doing nothing on else is fine */
        if (list.length > 0) {
            screenWithString(list);
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
        if (value === null) {
            return req.cookies[key];
        } else if (typeof value === 'string') {
            if (value.length > 0) {
                const head = value[0], rest = value.slice(-(value.length - 1));
                if (head === '?') {
                    return (req.query)[head === rest ? key : rest];
                } else if (head === ':') {
                    return (req.params)[head === rest ? key : rest];
                } else if (head === '@') {
                    return (req.body /* istanbul ignore next */ || {})[head === rest ? key : rest];
                } else if (head === '*') {
                    return (process.env)[head === rest ? key : rest];
                } else {
                    return value;
                }
            } else {
                return '';
            }
        } else {
            return value + '';
        }
    };
    return _.mapValues(_interface, function (value, key) {
        return resolveValue(req, key, value);
    });
};

/**
 * Screen `req.cookies` with option
 *
 * @param {Object} [option] it is {} by default
 * @return {Object} A screened cookies object with key value pairs
 * @public
 */

const cookieScreener = (option = {}) => {
    return function (req, res, next) {
        /* istanbul ignore else: for doing nothing is perfectly fine in else clause */
        if (req.cookies) {
            const mode = option.mode;
            const list = option.list;
            const _interface = option.interface;

            /* istanbul ignore else: for doing nothing is perfectly fine in else clause */
            if (mode) { //  mode is defined
                const mode_normalized = mode.toLowerCase();  //  normalize mode;

                /* istanbul ignore else: for doing nothing is perfectly fine in else clause */
                if (mode_normalized === 'whitelist') {
                    req.cookies = screenWithList(req.cookies, list, true);
                } else if (mode_normalized === 'blacklist') {
                    req.cookies = screenWithList(req.cookies, list);
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