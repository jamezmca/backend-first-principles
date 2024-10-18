import jwt from 'jsonwebtoken'

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']

    if (!token) { return res.status(401).json({ message: 'No token provided' }) }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) { return res.status(401).json({ message: 'Invalid token' }) }

        req.userId = decoded.id
        next()
    })
}

export default authMiddleware
