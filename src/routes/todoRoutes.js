import express from 'express'
import db from '../db.js'

const router = express.Router()

// Get all todos for logged-in user
router.get('/', (req, res) => {
    const getTodos = db.prepare('SELECT * FROM todos WHERE user_id = ?')
    const todos = getTodos.all(req.userId)
    res.json(todos)
})

// Create a new todo
router.post('/', (req, res) => {
    const { task } = req.body
    const insertTodo = db.prepare('INSERT INTO todos (user_id, task) VALUES (?, ?)')
    insertTodo.run(req.userId, task)

    res.json({ id: insertTodo.lastID, task, completed: 0 })
})

// Update a todo
router.put('/:id', (req, res) => {
    const { task, completed } = req.body
    const updateTodo = db.prepare('UPDATE todos SET task = ?, completed = ? WHERE id = ? AND user_id = ?')
    const isCompleted = completed ? 1 : 0
    updateTodo.run(task, isCompleted, req.params.id, req.userId)

    res.json({ message: 'Todo updated' })
})

// Delete a todo
router.delete('/:id', (req, res) => {
    const deleteTodo = db.prepare('DELETE FROM todos WHERE id = ? AND user_id = ?')
    deleteTodo.run(req.params.id, req.userId)

    res.json({ message: 'Todo deleted' })
})

export default router
