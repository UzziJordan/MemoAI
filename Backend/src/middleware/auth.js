//Imports
const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        //Check if header exists and starts with Bearer
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authorization header missing or malformed' });
        }

        //Get token from "Bearer <token>"
        const token = authHeader.split(' ')[1];

        //Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //Attach user ID to request object
        req.user = { id: decoded.id };
        next();
    } catch (err) {
        console.error('Authentication error', err);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }   
};

module.exports = protect;


