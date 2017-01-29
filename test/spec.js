const cookieScreener = require('./../index');
const errMsg = require('../errorMessage');
const expect = require('chai').expect;


describe('cookieScreener', function () {
    var req, screener;

    beforeEach(function () {
        req = {
            cookies: {
                foo: 'foo',
                bar: 'bar',
                sid: 'sid'
            }
        };
        screener = undefined;
    });

    it('should throw error if mode is not provided', function () {
        //  no cookie in header
        expect(()=>cookieScreener()).to.throw(errMsg.mode);
    });

    it('should throw error if mode is not valid', function () {
        //  no cookie in header
        expect(()=>cookieScreener({mode: 'white'})).to.throw(errMsg.mode);
    });

    it('should throw error if list is not provided', function () {
        //  no cookie in header
        expect(()=>cookieScreener({mode: 'whitelist'})).to.throw(errMsg.list);
    });

    it('should throw error if list is not valid', function () {
        //  no cookie in header
        expect(()=>cookieScreener({mode: 'whitelist', list: {}})).to.throw(errMsg.list);
        expect(()=>cookieScreener({mode: 'whitelist', list: 1})).to.throw(errMsg.list);
        expect(()=>cookieScreener({mode: 'whitelist', list: ''})).to.throw(errMsg.list);
        expect(()=>cookieScreener({mode: 'whitelist', list: []})).to.throw(errMsg.list);
    });

    it('should do nothing if `req.cookies` is undefined', function () {
        //  no cookie in header
        req = {};

        //  even use option
        screener = cookieScreener({
            mode: 'whitelist',
            list: 'bar'
        });

        screener(req, {}, () => {
            expect(req.cookies).to.be.an('undefined');
        });
    });

    it('should screen cookie header properly with whitelist mode and one key on list', function () {
        screener = cookieScreener({
            mode: 'whitelist',
            list: 'bar'
        });
        screener(req, {}, () => {
            expect(req.cookies).to.deep.equal({
                bar: 'bar'
            });
        });
    });

    it('should screen cookie header properly with whitelist mode and multiple keys on list', function () {
        screener = cookieScreener({
            mode: 'whitelist',
            list: ['bar', 'sid', 'zoo']
        });
        screener(req, {}, () => {
            expect(req.cookies).to.deep.equal({
                bar: 'bar',
                sid: 'sid'
            });
        });
    });

    it('should screen cookie header properly with blacklist mode and one key on list', function () {
        screener = cookieScreener({
            mode: 'blacklist',
            list: 'bar'
        });
        screener(req, {}, () => {
            expect(req.cookies).to.deep.equal({
                foo: 'foo',
                sid: 'sid'
            });
        });
    });

    it('should screen cookie header properly with blacklist mode and multiple keys on list', function () {
        screener = cookieScreener({
            mode: 'blacklist',
            list: ['bar', 'sid', 'zoo']
        });
        screener(req, {}, () => {
            expect(req.cookies).to.deep.equal({
                foo: 'foo'
            });
        });
    });
});