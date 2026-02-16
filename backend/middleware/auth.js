const jwt = require('jsonwebtoken');

/**
 * Auth Middleware
 * Extracts the JWT from the Authorization header (Bearer <token>),
 * verifies it, and attaches the decoded user payload to `req.user`.
 * Returns 401 if the token is missing or invalid.
 */
const auth = (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided, authorization denied' });
        }

        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user info to request (id from the token payload)
        req.user = { id: decoded.id };
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token is invalid or expired' });
    }
};

module.exports = auth;
