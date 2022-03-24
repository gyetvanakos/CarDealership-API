const router = require ("express").Router();
const req = require("express/lib/request");
const cars = require ("../models/cars");
const { verifyToken } = require("../validation");


router.post("/", verifyToken, (req, res) => {

    data = req.body;

    cars.insertMany(data)
    .then(data => {res.send(data);})
    .catch(err => {res.status(500).send({message: err.message });})
});


router.get("/", (req, res) => {
    cars.find()
    .then(data => {res.send(data);})
    .catch(err => {res.status(500).send({message: err.message });})
});

/*router.get("/cars/:color", function (req, res) {
    var cars = req.db.get ('cars'),
    query = req.query;
    if (query.hasOwnProperty("color")){
        query["color"] = parseInt(query.color);

    cars.find(query, function (err, docs) {
        res.json({length: docs.length, records: docs});    
        });
    }});*/

/*router.get("/cars/:color", (req, res) => {
    const color = req.params.color;

    let filterColor = req.params.color;
    
    cars.findOne({ color: filterColor })
    .then(data => {res.send(data);})
    .catch(err => {res.status(500).send({message: err.message });})
});*/

router.get("/price/:operator/:price", (req, res) => {
    const operator = req.params.operator;
    const price = req.params.price;

    let filterExpr = {$lte: req.params.price};

    if (operator == "gt")
        filterExpr = {$gte: req.params.price};

    cars.find({ price: filterExpr })
    .then(data => { res.send(data); })
    .catch(err => { 
        res.status(500).send({ message: err.message }); 
    });

});

router.get("/:id", (req, res) => {
    cars.findById(req.params.id)
    .then(data => {res.send(data);})
    .catch(err => {res.status(500).send({message: err.message });})
});


router.put("/:id", verifyToken, (req, res) => {

    const id = req.params.id;

    cars.findByIdAndUpdate(id, req.body)
    .then(data => { 
        if(!data)
        {
            res.status(404).send({message: "Cannot update car :( id=" + id})
        }
        else
        {
            res.send({ message: "Car is updated :)"})
        }
    })
    .catch(err => { res.status(500).send({ message: "error updating product with id=" + id }); });
});


router.delete("/:id", verifyToken, (req, res) => {

    const id = req.params.id;

    cars.findByIdAndDelete(id)
    .then(data => { 
        if(!data)
        {
            res.status(404).send({message: "Cannot delete car :( id=" + id})
        }
        else
        {
            res.send({ message: "Car is deleted :)"})
        }
    })
    .catch(err => { res.status(500).send({ message: "error deleting product with id=" + id }); });

});  




module.exports = router;