const jwt = require("jsonwebtoken");

const authUser = (req, res, next) => {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            message: 'Unauthorized. No token provided.'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        req.user = decoded;
        console.log("Decoded token:", decoded);
        next();

    } catch (error) {
        return res.status(403).json({
            message: 'Forbidden - Invalid or expired token',
        });
    }
};

module.exports = authUser;