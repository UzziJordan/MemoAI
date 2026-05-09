//Import Moongoose
const mongoose = require('mongoose');

//Create UserTodo Schema
const userTodoSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});
module.exports = mongoose.model('UserTodo', userTodoSchema);