const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

    console.log("REQ",req.headers);
    if (req){
        if (!req.headers.authorization && !req.headers['x-access-token']) {
            console.log("UNAUTHORIZED");
            return res.status(401).end();
        }
    }

    let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase

    token = token.split(' ')[1];

    if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
    }
    //
    // return jwt.verify(token, process.env.JWTSECRET, (err, decoded) => {
    //
    //     if (err) {
    //         console.log("error encountered");
    //         return res.status(401).end();
    //     }
    //
    //     req.userData = {
    //         tokenID: token,
    //         username: decoded.username,
    //     };
    //     console.log("In raven middleware, req:",req.userData);
    //     return next();
    //
    // });


    const decoded =  jwt.verify(token, process.env.JWTSECRET)
    console.log("IN MIDDLEWARE, decoded: ",decoded);
    req.userData = {
        exp: decoded.exp,
        username: decoded.username,
    };
    return next();
};