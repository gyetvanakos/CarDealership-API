process.env.NODE_ENV = 'test';

const Cars = require('../models/cars');
const User = require('../models/user');


beforeEach((done) => {
    Cars.deleteMany({}, function (err) {});
    User.deleteMany({}, function(err) {});
    done();
});

afterEach((done) => {
    Cars.deleteMany({}, function (err) {});
    User.deleteMany({}, function(err) {});
    done();
});
/*const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');*/

/*chai.use(chaiHttp);

before((done) => {
    Cars.deleteMany({}, function(err){});
    done();
});

after((done) => {
    //Cars.deleteMany({}, function(err){});
    done();
});

describe('/First test collection', function (){
    it('test default API welcome route...', (done) => {
        chai.request(server)
        .get('/api/welcome')
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            const actualVal = res.body.message;
            expect(actualVal).to.be.equal('Welcome');
            done();
        })     
    })

    it('should verify that we have 0 cars in db', (done) => {
        chai.request(server)
        .get('/api/cars')
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.eql(0);
            done();
        }) 
    });

    it('should post a car', (done) => {
        let car = {
                brand: "Test car",
                model: "Swift 2004",
                price: 2500,
                color: "white"  
        }

        chai.request(server)
        .post('/api/cars')
        .send(car)
        .end((err, res) => {
            res.should.have.status(200);
            done();
        }) 
    });

    it('should verify that we have 1 cars in db', (done) => {
        chai.request(server)
        .get('/api/cars')
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.eql(1);
            done();
        }) 
    });

    it('', function (){
        let expectedVal = 10;
        let actualVal = 10;

        expect(actualVal).to.be.equal(expectedVal);

    })
})*/