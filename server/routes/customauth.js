var express = require('express');
var router = express.Router();

router.get('/raven', function(req, res, next) {
    console.log("In raven/auth route, req.userData: ");
    let success_flag = res.status !== 401 && req.userData;
    return res.json({
        auth: success_flag,
        message: success_flag ? "Authenticated!!" : "Sadly not"
    });
});

module.exports = router;