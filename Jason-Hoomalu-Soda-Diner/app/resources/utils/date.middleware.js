//middleware for checking to see if item is just added (wihtin two minutes)
//if ISO date older than two minutes NEW badge is removed and DB is updated to show status false 
//same logic for updated or edited soda/diner
//Used for DINER AND SODAS 
module.exports = {
  checkNew: (Model) => (req, res, next) => {
    Model.find({}).then(data => {
      data.forEach(({ createdOn, _id, lastModified }) => {
        let now = Date.now()
        let itemModified = lastModified.getTime()
        let itemCreated = createdOn.getTime()
        if (now - itemCreated > 120000) {
          Model.findByIdAndUpdate({ _id: _id }, { $set: { justAdded: false } })
            .catch(err => console.log(err))
        }
        if (now - itemModified > 120000) {
          Model.findByIdAndUpdate({ _id: _id }, { $set: { justUpdated: false } })
            .catch(err => console.log(err))
        }
      })
    })
    next() // sends to controller to handle response
  }
}
