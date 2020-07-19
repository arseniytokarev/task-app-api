const express = require('express')
const path = require('path')
const hbs = require('hbs')
require('./db/database')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const profileRouter = require('./routers/profile')
const jwt = require('jsonwebtoken')

const app = express()
const port = process.env.PORT
app.use(express.json())

// Cookies
var cookieParser = require('cookie-parser')
app.use(cookieParser())


// parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));

// Setup up directories
app.use(express.static(path.join(__dirname, '../public')))
const partialsPath = path.join(__dirname, '../templates/partials')
const viewsPath = path.join(__dirname, '../templates/views')

// view engine
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

app.use(taskRouter)
app.use(userRouter)

app.get('*', function (req, res) {
    res.render('404')
});


app.listen(port, () => {
    console.log('Server is up on port ' + port)
})