const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const server = require('../server');
chai.use(chaiHttp);

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

    it('', function (){
        let expectedVal = 10;
        let actualVal = 10;

        expect(actualVal).to.be.equal(expectedVal);

    })
})