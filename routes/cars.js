const router = require ("express").Router();
const req = require("express/lib/request");
const cars = require ("../models/cars");
const { verifyToken } = require("../validation");
const NodeCache = require('node-cache');
//stdTTL (standard time to live)
const cache = new NodeCache({stdTTL: 600});



//Create

router.post("/", /*verifyToken,*/ (req, res) => {

    data = req.body;

    cars.create(data)
    .then(data => {
        cache.flushAll();
        res.send(data);})
    .catch(err => {res.status(500).send({message: err.message });})
});



//Read

-router.get("/", (req, res) => {
    cars.find()
    .then(data => {res.send(data);})
});

//get cars based on brands
router.get("/:brand", (req, res) => {
    cars.find({ brand: req.params.brand })

    .then(data => {res.send(data);})
    .catch(err => {res.status(500).send({message: err.message });})
});

//get cars based on model
router.get("/:brand/:model", (req, res) => {
    cars.find({ brand: req.params.brand })
    cars.find({ model: req.params.model })

    .then(data => {res.send(data);})
    .catch(err => {res.status(500).send({message: err.message });})
});


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


//Update

router.put("/:id", verifyToken, (req, res) => {

    const id = req.params.id;

    cars.findByIdAndUpdate(id, req.body, {new:true})
    .then(data => { 
        if(!data)
        {
            res.status(404).send({message: "Cannot update car :( id=" + id})
        }
        else
        {
            res.send(data)
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