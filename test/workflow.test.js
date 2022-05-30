const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const cars = require('../models/cars');
const server = require('../server');
chai.use(chaiHttp);

describe('User workflow tests', () => {

    it('should register + login a user, create Car and verify 1 in DB', (done) => {

        // 1) Register new user
        let user = {
            name: "Test Name",
            email: "testmail@mail.com",
            password: "123456"
        }
        chai.request(server)
            .post('/api/user/register')
            .send(user)
            .end((err, res) => {

                // Asserts
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('object');
                expect(res.body.error).to.be.equal(null);

                // 2) Login the user
                chai.request(server)
                    .post('/api/user/login')
                    .send({
                        "email": "testmail@mail.com",
                        "password": "123456"
                    })
                    .end((err, res) => {
                        // Asserts                        
                        expect(res.status).to.be.equal(200);
                        expect(res.body.error).to.be.equal(null);
                        let token = res.body.data.token;

                        // 3) Create new product
                        let cars = {
                            brand: "Test Car",
                            model: "Test Car Description",
                            price: 100000,
                            color: "red"
                        };

                        chai.request(server)
                            .post('/api/cars')
                            .set({
                                "auth-token": token
                            })
                            .send(cars)
                            .end((err, res) => {

                                // Asserts
                                expect(res.status).to.be.equal(200);
                                expect(res.body).to.be.a('array');
                                expect(res.body.length).to.be.eql(1);

                                let savedCar = res.body[0];
                                expect(savedCar.brand).to.be.equal(cars.brand);
                                expect(savedCar.model).to.be.equal(cars.model);
                                expect(savedCar.price).to.be.equal(cars.price);
                                expect(savedCar.color).to.be.equal(cars.color);

                                // 4) Verify one product in test DB
                                chai.request(server)
                                    .get('/api/cars')
                                    .end((err, res) => {

                                        // Asserts
                                        expect(res.status).to.be.equal(200);
                                        expect(res.body).to.be.a('array');
                                        expect(res.body.length).to.be.eql(1);

                                        done();
                                    });
                            });
                    });
            });
    });


    it('should register + login a user, create product and delete it from DB', (done) => {

        // 1) Register new user
        let user = {
            name: "Test Name",
            email: "testmail@mail.com",
            password: "123456"
        }
        chai.request(server)
            .post('/api/user/register')
            .send(user)
            .end((err, res) => {

                // Asserts
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('object');
                expect(res.body.error).to.be.equal(null);

                // 2) Login the user
                chai.request(server)
                    .post('/api/user/login')
                    .send({
                        "email": "testmail@mail.com",
                        "password": "123456"
                    })
                    .end((err, res) => {
                        // Asserts                        
                        expect(res.status).to.be.equal(200);
                        expect(res.body.error).to.be.equal(null);
                        let token = res.body.data.token;

                        // 3) Create new product
                        let cars = {
                            brand: "Test Car",
                            model: "Test Car Description",
                            price: 100000,
                            color: "red"
                        };

                        chai.request(server)
                            .post('/api/cars')
                            .set({
                                "auth-token": token
                            })
                            .send(cars)
                            .end((err, res) => {

                                // Asserts
                                expect(res.status).to.be.equal(200);
                                expect(res.body).to.be.a('array');
                                expect(res.body.length).to.be.eql(1);

                                let savedCar = res.body[0];
                                expect(savedCar.brand).to.be.equal(cars.brand);
                                expect(savedCar.model).to.be.equal(cars.model);
                                expect(savedCar.price).to.be.equal(cars.price);
                                expect(savedCar.color).to.be.equal(cars.color);


                                //4) wannabe update
                                let car = new updatedCar({
                                    brand: "Test Car",
                                    model: "Test Car Description",
                                    price: 100000,
                                    color: "red"
                                })
                                car.save((err, savedCar) => {
                                    chai.request(server)
                                        .put('/cars/' + savedCar._id)
                                        .set({
                                            "auth-token": token
                                        })
                                        .send({
                                            brand: "Test Car",
                                            model: "Test Car Description",
                                            price: 120000,
                                            color: "blue"
                                        })
                                        .end((err, res) => {

                                            // Asserts
                                            expect(res.status).to.be.equal(200);
                                            expect(res.body).to.be.a('object');
                                            expect(res.cars.color).to.be.eql('blue');
                                            done();
                                        });


                                    // 5) Delete product
                                    chai.request(server)
                                        .delete('/api/cars/' + savedCar._id)
                                        .set({
                                            "auth-token": token
                                        })
                                        .end((err, res) => {

                                            // Asserts
                                            expect(res.status).to.be.equal(200);
                                            const actualVal = res.body.message;
                                            expect(actualVal).to.be.equal('Car is deleted :)');
                                            done();
                                        });
                                });
                            });
                    });
            });

        it('should register user with invalid input', (done) => {

            // 1) Register new user with invalid inputs
            let user = {
                name: "Peter Petersen",
                email: "mail@petersen.com",
                password: "123" //Faulty password - Joi/validation should catch this...
            }
            chai.request(server)
                .post('/api/user/register')
                .send(user)
                .end((err, res) => {

                    // Asserts
                    expect(res.status).to.be.equal(400); //normal expect with no custom output message
                    //expect(res.status,"Status is not 400 (NOT FOUND)").to.be.equal(400); //custom output message at fail

                    expect(res.body).to.be.a('object');
                    expect(res.body.error).to.be.equal("\"password\" length must be at least 6 characters long");
                    done();
                });
        });

        /*describe('/GET cars', () => {
            it('it should GET all the cars', (done) => {
                chai.request(server)
                    .get('/cars')
                    .end((err, res) => {
                        expect(res.status).to.be.equal(200);
                        expect(res.body).to.be.a('array');
                        expect(res.body.length).to.be.eql(0);
                        done();
                    });
            });
        });*/

        /*describe('/PUT/:id car', () => {
            it('it should UPDATE a car given the id', (done) => {
                let car = new cars({
                    price: 12000,
                    color: "blue"
                })
                car.save((err, car) => {
                    chai.request(server)
                        .put('/cars/' + cars.id)
                        .send({
                            price: 12000,
                            color: "blue"
                        })
                        .end((err, res) => {

                            // Asserts
                            expect(res.status).to.be.equal(200);
                            expect(res.body).to.be.a('object');
                            expect(res.cars.color).to.be.eql('blue');
                            done();
                        });
                });
            });
        });*/
    });
});