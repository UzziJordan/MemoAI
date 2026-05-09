const express = require('express');
const { createUserTodo, getUserTodos, getUserTodoById, updateUserTodo, deleteUserTodo } = require('../controllers/userTodo.controller');
const protect = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
    .post(createUserTodo)
    .get(getUserTodos);

router.route('/:id')
    .get(getUserTodoById)
    .patch(updateUserTodo)
    .delete(deleteUserTodo);

module.exports = router;