const mongoose = require('mongoose')

//create soda schema and model
const SodaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, //must be included for document to be created
        unique: true //must not match and other name in the collection
    },
    fizziness: {
        type: String,
        required: true
    },
    rating: {
        type: String,
        required: true
    },
    justAdded: {
        type: Boolean,
        default: true
    },
    justUpdated: {
        type: Boolean,
        default: false
    },
    createdOn: {
        type: Date,
        default: () => Date.now()
    },
    lastModified: {
        type: Date,
        default: () => Date.now()
    },
    available: {
        type: Boolean,
        default: true,
    }
})

//create and export model
const Soda = mongoose.model('Soda', SodaSchema)
module.exports = Soda