const jwt = require('jsonwebtoken');
const User = require('../models/User');


module.exports = (req, res, next) => {

    if (!req.headers.authorization) {
        console.log("UNAUTHORIZED");
        return res.status(401).end();
    }

    const token = req.headers.authorization.split(' ')[1];

    return jwt.verify(token, process.env.JWTSECRET, (err, decoded) => {
        console.log("MIDDLEWARE")

        if (err) {
            return res.status(401).end();
        }

        req.userData = {
            tokenID: token,
            userid: decoded._id,
            username: decoded.username,
        };

        return next();


    });

};