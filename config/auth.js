const jwt = require('jsonwebtoken');

// Get Token
const getToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
        // Split at the space
        const bearer = bearerHeader.split(' ');
        // Get token from array
        const bearerToken = bearer[1];
        // Set the token
        req.token = bearerToken;
    }
    next();
}

const verifyToken = (req, res, next) => {
    //verify token
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        }
        console.log(authData);
    })
    next();
}

module.exports = {
    getToken,
    verifyToken
}