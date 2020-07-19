const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    }, owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task