const express = require('express')
const controllers = require('./diners.controllers')
const middleware = require('../utils/date.middleware')
const Diners = require('../diners/diners.models')
const CRUD = require('../utils/crud.controllers')
const router = express.Router()

//middleware for checking if item is new and updating the DB if its been over 2 minutes
router.use('/diners', middleware.checkNew(Diners))

//uses CRUD controllers shared across that platform as well as controllers unique to diners
//some delete/put handled partially with AJAX in index.js
router.route('/diners')
  .get(CRUD.showAll(Diners))

router.route('/diners/:id')
  .get(controllers.showDetails)
  .delete(CRUD.deleteItem(Diners))
  .put(controllers.deleteDinerSodas)

router.route('/diners-new')
  .get(CRUD.showForm(Diners))
  .post(CRUD.createItem(Diners))

router.route('/diners-sodas/:id')
  .get(controllers.showDinerSodas)
  .put(controllers.editDinerSodas)

router.route('/diners-edit/:id')
  .get(CRUD.showEditForm(Diners))
  .post(CRUD.editDetails(Diners))

module.exports = router
