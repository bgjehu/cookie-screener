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
const errMsg = require('./errorMessage');

/**
 * Screen `req.cookies` with options
 *
 * @param {Object} [options] it is {} by default
 * @return {Object} A screened cookies object with key value pairs
 * @public
 */

const cookieScreener = (options = {}) => {
    const whitelist = 'whitelist';
    const blacklist = 'blacklist';
    const mode = (options.mode || '').toLowerCase();
    const list = options.list;

    if (mode !== whitelist && mode !== blacklist) {
        throw new Error(errMsg.mode);
    }

    if (_.isString(list) || _.isArray(list)) {
        if (list.length === 0) {
            throw new Error(errMsg.list);
        }
    } else {
        throw new Error(errMsg.list);
    }

    return function (req, res, next) {

        if (req.cookies) {

            //  istanbul ignore else: it ruled out
            if (mode === 'whitelist') {
                req.cookies = _.pick(req.cookies, list);
            } else if (mode === 'blacklist') {
                req.cookies = _.omit(req.cookies, list);
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