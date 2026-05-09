const UserTodo = require('../models/UserTodo');

//Create a new todo
exports.createUserTodo = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text || text.trim() === '') {
            return res.status(400).json({ message: 'Todo text is required' });
        }
        const userId = req.user.id;
        const todo = new UserTodo({ text: text.trim(), user: userId });
        await todo.save();
        res.status(201).json({ todo });
    } catch (err) {
        console.error('Error creating todo', err);
        res.status(500).json({ message: 'Server error' });
    }
};

//Get all todos for the authenticated user
exports.getUserTodos = async (req, res) => {
    try { 
        const userId = req.user.id;
        const todos = await UserTodo.find({ user: userId }).sort({ createdAt: -1 });
        res.status(200).json({ todos });
    } catch (err) {
        console.error('Error fetching todos', err);
        res.status(500).json({ message: 'Server error' });
    }
};

//Update a todo
exports.updateUserTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const { text, completed } = req.body;
        const userId = req.user.id;

        //Validate input
        if ( text !== undefined && text.trim() === '') {
            return res.status(400).json({ message: 'Todo text is required' });
        }
        //Only update fields that are provided in the request body
        const updateData = {};
        if (text !== undefined ) updateData.text = text.trim();
        if (completed !== undefined) updateData.completed = completed;

        const todo = await UserTodo.findOneAndUpdate({ _id: id, user: userId }, { $set: updateData }, { returnDocument: 'after' });

        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.status(200).json({ todo });
    } catch (err) {
        console.error('Error updating todo', err);
        res.status(500).json({ message: 'Server error' });
    }
};

//Delete a todo
exports.deleteUserTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const todo = await UserTodo.findOneAndDelete({ _id: id, user: userId });
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.status(200).json({ message: 'Todo deleted' });
    } catch (err) {
        console.error('Error deleting todo', err);
        res.status(500).json({ message: 'Server error' });
    }
};

//Get a single todo by ID
exports.getUserTodoById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const todo = await UserTodo.findOne({ _id: id, user: userId });
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.status(200).json({ todo });
    } catch (err) {
        console.error('Error fetching todo', err);
        res.status(500).json({ message: 'Server error' });
    }
};
