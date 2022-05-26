const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const server = require('../server');
chai.use(chaiHttp);

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
                    let car =
                    {
                        brand: "Test Car",
                        model: "Test Car Description",
                        price: 100000,
                        color: "red"
                    };

                    chai.request(server)
                        .post('/api/cars')
                        .set({ "auth-token": token })
                        .send(car)
                        .end((err, res) => {
                            
                            // Asserts
                            expect(res.status).to.be.equal(200);                                
                            expect(res.body).to.be.a('array');
                            expect(res.body.length).to.be.eql(2);
                            
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