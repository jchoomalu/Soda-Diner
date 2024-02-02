const mongoose = require('mongoose')
const Diners = require('./diners.models')
const Sodas = require('../sodas/sodas.models')

//Diner controllers that are mostly unique to diners and not included in CRUD operations
module.exports = {
    //checks diner sodas against available sodas to render only those currently available
    showDetails(req, res) {
        Diners.findById(req.params.id)
            .then(data => {
                Sodas.find({ available: true }, { name: true, _id: false })
                    .then(more => {
                        let availableSodas = []
                        more.forEach(a => availableSodas.push(a.name))
                        let available = data.sodas.filter(value => -1 !== availableSodas.indexOf(value))
                        res.render('pages/dinerInfo', {
                            data,
                            available
                        })
                    })
            })
            .catch(() => res.render('pages/500-Error'))
    },
    //Compares all sodas to currently served and outputs list that user can add
    //to the specific diner
    showDinerSodas(req, res) {
        Sodas.find({ available: true }, { name: true })
            .then(sodas => {
                Diners.findById({ _id: req.params.id }, { _id: false, sodas: true })
                    .then(current => {
                        let sodasArray = sodas.map(name => name.name)
                        current = current.sodas
                        let sodasUnavailable = sodasArray.filter(value => -1 == current.indexOf(value));
                        Sodas.find({ name: sodasUnavailable }).then(data => {
                            res.render('pages/dinerSodas', {
                                sodasId: data,
                                sodasServed: current,
                                sodasUnavailable: sodasUnavailable
                            })
                        })
                    })
            })
            .catch(() => res.render('pages/500-Error'))
    },
    //After selecting new sodas from the available (above) creates a new list of sodas 
    //and updates the array of sodas in the selceted diner
    editDinerSodas(req, res) {
        Diners.findById({ _id: req.body.dinerID }, { sodas: true })
            .then(data => {
                let updatedSodas = data.sodas.concat(JSON.parse(req.body.sodas))
                return updatedSodas
            })
            .then(updatedSodas => {
                Diners.findByIdAndUpdate({ _id: req.body.dinerID }, { $set: { sodas: updatedSodas } })
                    .catch(() => res.render('pages/500-Error'))
            })
            .catch(() => res.render('pages/500-Error'))
        res.sendStatus(200) //responds with success allowing ajax request to complete and refresh page
    },
    //deletes sodas from the sodas array of the specific diner, does not delete soda from DB
    deleteDinerSodas(req, res) {
        Diners.findById({ _id: req.body.dinerID })
            .then(data => updated = data.sodas.filter(remove => remove !== req.body.soda))
            .then(data => Diners.findByIdAndUpdate({ _id: req.body.dinerID }, { $set: { sodas: data } }))
            .catch(() => res.render('pages/500-Error'))
        res.sendStatus(200)//responds with success allowing ajax request to complete 
    }
}



