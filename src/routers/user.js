const express = require('express')
const app = express()
const router = new express.Router()
const User = require('../models/user')
const {auth, isAuthed} = require('../middleware/auth')
const jwt = require('jsonwebtoken')

const cookieParser = require('cookie-parser');
app.use(express.json());
app.use(cookieParser());

router.get('/', (req, res) => {
    res.render('index')
})

router.post('/register', async (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password1
    })

    if(user.password !== req.body.password2) {
       return res.render('register', {
           error: 'Passwords did not match'
       })
    }

    try {
        await user.save()
        const token = await user.generateAuthToken(res)
        res.redirect('/create')
    } catch (e) {
        res.render('register', {
            error: 'Please try again'
        })
    }
})

router.get('/register', async (req, res) => {
    res.render('register')
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        await user.generateAuthToken(res)
        res.redirect('/tasks')
    } catch (e) {
        res.render('login', {error: 'Please try again'})
    }
})

router.get('/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.redirect('/')
    } catch (e) {
        res.render('error')
    }
})

router.get('/delete-account', auth, async (req, res) => {
    res.render('delete')
})

router.post('/delete-account', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.redirect('/')
    } catch (e) {
        res.redirect('/404')
    }
})

router.get('/home', auth, async (req, res) => {
    res.render('home')
})




module.exports = router