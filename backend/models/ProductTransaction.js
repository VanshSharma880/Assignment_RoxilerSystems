const mongoose = require('mongoose');

const productTransactionSchema = new mongoose.Schema({
    id: Number,
    title: String,
    description: String,
    price: Number,
    image: String,
    dateOfSale: Date,
    category: String,
    sold: Boolean
});

const ProductTransaction = mongoose.model('ProductTransaction', productTransactionSchema);

module.exports = ProductTransaction;
