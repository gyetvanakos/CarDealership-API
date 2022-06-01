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