const mongoose = require('mongoose');

//Path to DB
const connectionString = 'mongodb://localhost/sodadiner'
//Connect to MongoDB
mongoose.connect(connectionString);

mongoose.connection.on('open', () => {
  console.log("Server connected to database.")
})

mongoose.connection.on("connected", () => {
  console.log(`Mongoose connected to ${connectionString}`)
})

mongoose.connection.on("error", (err) => {
  console.log(`Mongoose connected error ${err}`)
})

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected")
})
