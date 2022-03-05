const express = require("express");
const mongoose= require("mongoose");
const bodyParser = require("body-parser");
const app = express();

const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');

const swaggerDefinition = yaml.load('./swagger.yaml');
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDefinition));

const carRoutes = require("./routes/cars");
const authRoutes = require("./routes/auth");
const swaggerUiExpress = require("swagger-ui-express");

require("dotenv-flow").config();

app.use(bodyParser.json());

mongoose.connect(
    process.env.DBHOST,
    {
        useUnifiedTopology: true,
        useNewUrlParser: true
    }
).catch(error => console.log("Error connecting to db:"+ error));

mongoose.connection.once('open', () => console.log('Connected to db'));

app.get("/api/welcome",(req, res) => {

    res.status(200).send({message: "Welcome"});

})

app.use("/api/cars", carRoutes);
app.use("/api/user", authRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, function() {
    console.log("Server is running on port: " + PORT)
});

module.exports = app;