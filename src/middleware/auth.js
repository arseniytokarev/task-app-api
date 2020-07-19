const express = require('express')
const app = express()
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const cookieParser = require('cookie-parser');
app.use(express.json());
app.use(cookieParser());

const auth =  async (req, res, next) => {
    const token = req.cookies.token
    try {
        if (!token) {
            res.redirect('/login')
        } 

        const decoded = await jwt.verify(token, process.env.SECRET_KEY);

        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token})

        if (!user) {
            res.redirect('/login')
        }
        req.user = user;
        req.token = token
        next()

    } catch (e) {
        res.render('404')
    }
}

const isAuthed = async (req, res, next) => {
    const token = req.cookies.token
        if (!token) {
            res.render('404')
        }

        const decoded = await jwt.verify(token, 'secretKey');

        const user = await User.findOne({
            _id: decoded._id,
            'tokens.token': token
        })

        if (!user) {
            req.isAuthed = false
        }
        req.isAuthed = true;
        req.user = user
        next()
}




module.exports = {auth, isAuthed}

