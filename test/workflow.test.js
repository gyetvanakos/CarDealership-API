const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const server = require('../server');
chai.use(chaiHttp);

describe('User workflow tests', () => {

    it('should register + login a user, create car and verify 1 in DB', (done) => {

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
                        let token = res.body.data.token;

                        // 3) Create new car
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
                                expect(res.body).to.be.a('object');

                                let savedCar = res.body;
                                expect(savedCar.brand).to.be.equal(cars.brand);
                                expect(savedCar.model).to.be.equal(cars.model);
                                expect(savedCar.price).to.be.equal(cars.price);
                                expect(savedCar.color).to.be.equal(cars.color);

                                // 4) Verify one car in test DB
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


    it('should register + login a user, create car, update car and delete it from DB', (done) => {

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
                        let token = res.body.data.token;

                        // 3) Create new car
                        let car = {
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
                            .send(car)
                            .end((err, res) => {

                                // Asserts
                                expect(res.status).to.be.equal(200);
                                expect(res.body).to.be.a('object');

                                let savedCar = res.body;
                                expect(savedCar.brand).to.be.equal(car.brand);
                                expect(savedCar.model).to.be.equal(car.model);
                                expect(savedCar.price).to.be.equal(car.price);
                                expect(savedCar.color).to.be.equal(car.color);


                                //4) Updates car
                                chai.request(server)
                                    .put('/api/cars/' + savedCar._id)
                                    .set({
                                        "auth-token": token
                                    })
                                    .send({
                                        _id: savedCar._id,
                                        brand: "Bence Test car"
                                    })
                                    .end((err, res) => {

                                        let updatedCar = res.body

                                        // Asserts
                                        expect(res.status).to.be.equal(200);
                                        expect(res.body).to.be.a('object');
                                        expect(updatedCar.brand).to.be.eql('Bence Test car');


                                        // 5) Delete car
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