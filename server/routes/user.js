const userController = require('../controllers/UserController');
const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {

    userController.find(req.query, function(err, results){
        if(err){
            console.log(err);
            res.json({
                success: 0,
                error: err
            });
            return;
        }
        res.json({
            success: 1,
            data: results
        });
    });
});

router.post('/',function(req,res,next){
    userController.create(req.body, function(err,result){
        if(err){
            console.log(err);
            res.json({
                success:0,
                error:err
            })
            return;
        }

        res.json({
            success:1,
            data:result
        })
    })
});

router.get('/temporary', function(req, res, next) {
  res.send("HEY HO IM HERE");
  console.log("temporary testing here in user routing");
});

router.get('/:username', function(req, res, next){
    userController.find(req.params, function(err, result){
        console.log("in controller and id follows");
        console.log(req.params);

        if(err){
            console.log(err);
            res.status(500).json({
                success: 0,
                data: result
            });
            return;
        }

        res.status(200).json({
            success: 1,
            temp: "hey",
            data: result
        });
    });
});

router.get('/id/:id', function(req, res, next){
    const id = req.params.id;

    userController.findById(id, function(err, result){
        console.log("in controller and id follows");
        console.log(id);

        if(err){
            console.log(err);
            res.status(500).json({
                success: 0,
                data: result
            });
            return;
        }

        res.status(200).json({
            success: 1,
            temp: "hey",
            data: result
        });
    });
});

module.exports = router;