const mongoose = require('mongoose')

//create diner schema and model
const DinerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, //must be included for document to be created
        unique: true //must not match and other name in the collection
    },
    location: {
        type: String,
        required: true
    },
    sodas: {
        type: [String],
        required: true
    },
    createdOn: {
        type: Date,
        default: () => Date.now()
    },
    lastModified: {
        type: Date,
        default: () => Date.now()
    },
    justAdded: {
        type: Boolean,
        default: true
    },
    justUpdated: {
        type: Boolean,
        default: false
    },
})

//create and export model
const Diner = mongoose.model('Diner', DinerSchema)

module.exports = Diner
