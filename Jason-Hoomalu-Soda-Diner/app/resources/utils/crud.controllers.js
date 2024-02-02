const Sodas = require('../sodas/sodas.models')
const Diners = require('../diners/diners.models')

//CRUD logic used by both sodas and diners passes a Model 

//SHOW FROM UNIVERSAL CRUD CONTROLLER
const showForm = Model => async (req, res) => {
    let modelName = Model.modelName.toLowerCase()
    //only renders available sodas to the form options 
    Sodas.find({available: true}, { name: true, _id: false })
        .then(data => {
            res.render(`pages/${modelName}Form`, {
                data,
                existsError: ''
            })
        })
        .catch(() => res.render('pages/500-Error'))
}

//renders form for edit functionality
const showEditForm = Model => async (req, res) => {
    let modelName = Model.modelName.toLowerCase()
    Model.findById(req.params.id)
        .then(data => res.render(`pages/${modelName}Edit`, { data }))
}

//performs edit
const editDetails = Model => async (req, res) => {
    let modelName = Model.modelName.toLowerCase()
    console.log(req.body.fizziness)
    if (modelName === 'soda') {
        Model.findByIdAndUpdate(
            req.params.id,
            { $set: { name: req.body.name, fizziness: req.body.fizziness, rating: req.body.rating, lastModified: new Date(), justUpdated: true } }
        )
            .then(data => res.redirect('/sodas'))
            .catch(err => console.log(err))
    } else {
        Model.findByIdAndUpdate(
            req.params.id,
            { $set: { name: req.body.name, location: req.body.location, lastModified: new Date(), justUpdated: true } }
        )
            .then(data => res.redirect('/diners'))
    }
}

//FIND MANY UNIVERSAL CRUD CONTROLLER
const showAll = Model => async (req, res) => {
    let modelName = Model.modelName.toLowerCase()
    Model.find({}).then(data => {
        res.render(`pages/${modelName}s`, { data })
    })
        .catch(() => res.render('pages/500-Error'))
}
//DELETE UNIVERSAL CRUD CONTROLLER
const deleteItem = Model => async (req, res) => {
    Model.findByIdAndDelete({ _id: req.params.id })
        .then(data => res.send('Permanantly deleted.'))
        .catch(() => res.render('pages/500-Error'))
}

//CREATE UNIVERSAL CRUD CONTROLLER 
//listens for error 11000 (duplicate) set by unique identifier in schema or required field
//did not use client side validation on the input fields in order to demonstrate this method of server validation
const createItem = Model => async (req, res) => {
    let modelName = Model.modelName.toLowerCase()
    Model.create(req.body)
        .then(data => {
            res.redirect(`/${modelName}s/` + data._id)
        })
        .catch(err => err.code === 11000 ? res.render(`pages/${modelName}Form`, {
            data: [''],
            existsError: `That ${modelName} is already in our database.`
        }) : res.render(`pages/${modelName}Form`, {
            data: [''],
            existsError: `${err._message}, all fields are required.`
        })
        )
}

module.exports.showAll = showAll
module.exports.showForm = showForm
module.exports.showEditForm = showEditForm
module.exports.editDetails = editDetails
module.exports.createItem = createItem
module.exports.deleteItem = deleteItem
