const accommodationController = require('../controllers/AccommodationController')
const express = require('express')
const router = express.Router()

router.get('/', function(req, res, next) {

    accommodationController.find(req.query, function(err, results){
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
    accommodationController.create(req.body, function(err,result){
        if(err){
            console.log(err);
            res.json({
                success:0,
                error:err
            });
            return;
        }

        res.json({
            success:1,
            data:result
        })
    })
});

router.post('/:id', function(req,res,next){
    accommodationController.update(req.params.id, req.body,function(err,result){
        if(err){
            console.log(err);
            res.json({
                success:0,
                error:err
            });
            return;
        }

        res.json({
            success:1,
            data:result
        })
    })
});

router.get('/:id', function(req, res, next){
    const id = req.params.id;

    accommodationController.findById(id, function(err, result){

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
            data: result
        });
    });
});

module.exports = router