import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db.js'

const router = express.Router()

// Register route
router.post('/register', (req, res) => {
    const { username, password } = req.body
    const hashedPassword = bcrypt.hashSync(password, 8)

    try {
        const insertUser = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)')
        const result = insertUser.run(username, hashedPassword)

        const insertTodo = db.prepare('INSERT INTO todos (user_id, task) VALUES (?, ?)')
        insertTodo.run(result.lastInsertRowid, 'Hello! Add your first todo!')

        const token = jwt.sign({ id: result.lastInsertRowid }, process.env.JWT_SECRET, { expiresIn: '24h' })
        res.json({ token })
    } catch (err) {
        console.log(err.message)
        res.sendStatus(503)
    }
})

// Login route
router.post('/login', (req, res) => {
    const { username, password } = req.body

    try {
        const getUser = db.prepare('SELECT * FROM users WHERE username = ?')
        const user = getUser.get(username)

        if (!user) { return res.status(404).json({ message: 'User not found' }) }

        const passwordIsValid = bcrypt.compareSync(password, user.password)
        if (!passwordIsValid) { return res.status(401).json({ message: 'Invalid password' }) }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' })
        res.json({ token })
    } catch (err) {
        console.log(err.message)
        res.sendStatus(503)
    }
})

export default router