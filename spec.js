const cookieScreener = require('./index');
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

    it('should not screen if no option provided', function () {
        screener = cookieScreener();
        screener(req, {}, () => {
            expect(req.cookies).to.deep.equal({
                foo: 'foo',
                bar: 'bar',
                sid: 'sid'
            });
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

    it('should screen cookie header properly with interface mode', function () {
        //  mocking req and env
        req.query = {q0: 'Q0', q1: 'Q1'};
        req.params = {p0: 'P0', p1: 'P1'};
        req.body = {b0: 'B0', b1: 'B1'};
        process.env.E0 = 'e0';
        process.env.E1 = 'e1';

        screener = cookieScreener({
            mode: 'interface',
            interface: {
                foo: null,
                bar: 1.2,
                sid: '',
                zoo: 'zoo',
                q0: '?',
                q1: '?q1',
                p0: ':',
                p1: ':p1',
                b0: '@',
                b1: '@b1',
                E0: '*',
                E1: '*E1'
            }
        });
        screener(req, {}, () => {
            expect(req.cookies).to.deep.equal({
                foo: 'foo',
                bar: '1.2',
                sid: '',
                zoo: 'zoo',
                q0: 'Q0',
                q1: 'Q1',
                p0: 'P0',
                p1: 'P1',
                b0: 'B0',
                b1: 'B1',
                E0: 'e0',
                E1: 'e1'
            });
        });
    });
});