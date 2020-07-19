const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})

// const task = new Task({
//     description: 'Andrew',
//     completed: false,
// })

// task.save().then((task) => {
//     console.log(task)
// }).catch((error) => {
//     console.log('Error!', error)
// })