const express = require('express')
const router = new express.Router()
const Task = require('../models/task')
const User = require('../models/user')
const {
    auth,
    isAuthed
} = require('../middleware/auth')


router.get('/tasks', auth, async (req, res) => {
    

    try {
        // const user = req.user
        // await user.populate('tasks').execPopulate()
        // res.render('tasks', {tasks: user.tasks})

        const user = req.user
        await user.populate('tasks').execPopulate()
        const tasks = user.tasks
        taskArray = []
        tasks.forEach((task) => {
            var taskDescription = task.description
            taskNew = taskDescription.slice(0, 100) + (taskDescription.length > 100 ? "..." : "");
            task.description = taskNew
            taskArray.push(task)
        })
        res.render('tasks', {tasks: tasks})
    } catch (e) {
        console.log(e)
        res.redirect('/404')
    }


})

router.get('/task/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findOne({_id})

        if (!task) {
            return res.render('404')
        }

        res.render('task', {task})
    } catch (e) {
        res.render('error')
    }
})

router.get('/create', auth, (req, res) => {
    res.render('create')
})

router.post('/create', auth, async (req, res) => {
    const task = new Task({
        description: req.body.description,
        owner: req.user._id
    }).save()

    try {
        res.redirect('/tasks')

    } catch (e) {
        res.render('error')
    }

})

router.get('/delete/:id', auth, async (req, res) => {
    try {
        const task = await Task.findByIdAndRemove(req.params.id)

        if (!task) {
            return res.redirect('/404')
        }

        res.redirect('/tasks')
    } catch (e) {
        res.render('error')
    }
})

router.get('/404', (req, res) => {
    res.render('404')
})

module.exports = router