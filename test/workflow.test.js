const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const server = require('../server');
chai.use(chaiHttp)

describe('User workflow tests', () => {

    it('should register + login a user, create car and verify 1 in DB', (done) => {
        done();
    });
})