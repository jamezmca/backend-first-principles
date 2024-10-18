import express from 'express'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import authRoutes from './routes/authRoutes.js'
import todoRoutes from './routes/todoRoutes.js'
import authMiddleware from './middleware/authMiddleware.js'
import db from './db.js'

const app = express()
app.use(express.json())

// Get the file path from the URL of the current module
const __filename = fileURLToPath(import.meta.url)
// Get the directory name from the file path
const __dirname = dirname(__filename)

// Serve HTML file from /public directory
// This tells Express to serve all the files inside the public folder as static files. So, any request for /css/styles.css will be resolved to the public/css/styles.css file
app.use(express.static(path.join(__dirname, '../public')))

// Routes
app.use('/auth', authRoutes)
app.use('/todos', authMiddleware, todoRoutes)

// Serve the index.html at the root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

// Define the function that logs the contents of the database
function logDatabaseContents() {
    const getUsers = db.prepare('SELECT * FROM users')
    const getTodos = db.prepare('SELECT * FROM todos')

    console.log('Logging database contents:')

    // Log users
    console.log('Users:')
    const users = getUsers.all()

    // Log todos
    console.log('Todos:')
    const todos = getTodos.all()
    console.log(todos)
}

// Set an interval to call the function every 30 seconds (30000 ms)
setInterval(logDatabaseContents, 15000)