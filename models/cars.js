const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let carsSchema = new Schema(
    {
        brand: { type: String, required: true, maxlength: 50 },
        model: { type: String, required: true, maxlength: 50 },
        price: { type: Number, required: true },
        color: { type: String, required: true, maxlength: 50 }
    }  
);

module.exports = mongoose.model("car", carsSchema);