const mongoose = require('mongoose')
const Sodas = require('../sodas/sodas.models')

module.exports = {
  stopServing: (req, res) => {
    if (req.body.start === 'true') {
      Sodas.findByIdAndUpdate(req.body.id, { $set: { available: true } })
        .catch(err => console.log(err))
      res.sendStatus(200)
    } else {
      Sodas.findByIdAndUpdate(req.body.id, { $set: { available: false } })
        .catch(err => console.log(err))
      res.sendStatus(200)
    }
  },
  showDetails: (req, res) => {
    Sodas.findById(req.params.id).then(data => {
      res.render('pages/sodaInfo', {
        data
      })
    })
  }
}