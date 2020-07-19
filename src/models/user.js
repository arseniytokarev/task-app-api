const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Task = require('./task')

const express = require('express')
const app = express()

const cookieParser = require('cookie-parser');
app.use(express.json());
app.use(cookieParser());

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    }, email: {
        type: String,
        unique: true,
        lowercase: true,
        required: true,
        trim: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('E-mail is invalid')
            }
        }
    }, password: {
        type: String,
        required: true,
        trim: true,
        minength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }

    }, avatar: {
        type: Buffer
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
})

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.generateAuthToken = async function(res) {
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, process.env.SECRET_KEY)

    user.tokens = user.tokens.concat({token})

    await user.save()

    return res.cookie('token', token, {
        secure: false, // set to true if your using https
        httpOnly: true,
    });
}

userSchema.pre('save', async function (next) {
    const user = this

    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne(
        { email }
    )

    if (!user) {
        throw new Error('No such user')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Passwords do not match')
    }

    return user
}

const User = mongoose.model('User', userSchema)

module.exports = User

