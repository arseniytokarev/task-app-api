const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const {
    auth,
    isAuthed
} = require('../middleware/auth')

// Image rendering
const multer = require('multer')
const sharp = require('sharp')

const upload = multer({
    limits: { 
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }
        cb(undefined, true)
    }
})

router.get('/profile-upload', auth, async (req, res) => {
    res.render('profile-input')
})

router.post('/profile-upload', auth, upload.single('image'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({
        width: 250,
        height: 250
    }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.render('image', {id: req.user._id})
}, (error, req, res, next) => {
    console.log(error)
})

router.get('/:id/avatar', async(req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        res.redirect('/404')
    }

})

router.get('/profile', async (req, res) => {
    res.render('profile')
})


module.exports = router