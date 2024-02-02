const express = require('express')
const middleware = require('../utils/date.middleware')
const controllers = require('../sodas/soda.controllers')
const Sodas = require('../sodas/sodas.models')
const CRUD = require('../utils/crud.controllers')
const router = express.Router()

//middleware for checking if item is new and updating the DB if its been over 2 minutes
router.use('/sodas', middleware.checkNew(Sodas))

//some controllers passed to the CRUD controllers, modularized to use same controller as Diners
//some delete/put handled partially with AJAX in index.js

router.route('/sodas')
    .get(CRUD.showAll(Sodas))

router.route('/sodas/:id')
    .get(controllers.showDetails)
    .put(controllers.stopServing)
    .delete(CRUD.deleteItem(Sodas))

router.route('/sodas-new')
    .get(CRUD.showForm(Sodas))
    .post(CRUD.createItem(Sodas))

router.route('/sodas-edit/:id')
    .get(CRUD.showEditForm(Sodas))
    .post(CRUD.editDetails(Sodas))

module.exports = router