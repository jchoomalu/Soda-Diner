const express = require('express')
const path = require('path')
const database = require('./app/config/database')
const dinersRoutes = require('./app/resources/diners/diners.routes')
const sodasRoutes = require('./app/resources/sodas/sodas.routes')
const app = express()
const PORT = 2020

//Sets up templating with EJS
app.set('views', path.join(__dirname, 'app/views'))
app.set('view engine', 'ejs')

//parsing and formating helpers
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//serves static files
app.use(express.static(path.join(__dirname, "./app/public")))

//routes for diners and sodas
app.use(dinersRoutes)
app.use(sodasRoutes)

//serves home page
app.get('/', (req, res) => {
    res.render('pages/index')
})

//serves error 404 page if user navigates to page that doesn't exist
app.get('*', (req, res) => {
    res.render('pages/404-Error')
})

app.listen(PORT, () => { console.log(`Listening on localhost:${PORT}`) })
