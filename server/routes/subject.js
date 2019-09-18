const subjectController = require('../controllers/SubjectController')
const express = require('express')
const router = express.Router()

//Note that the req.query is what follows the question mark
//req.params is what comes from the URL thingy.

router.get('/students/:subject', function(req, res, next){

    subjectController.findStudents(req.params, function(err, result){

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

//gets all of it!
router.get('/', function(req, res, next) {

    console.log(req.query);
    subjectController.find(req.query, function(err, results){
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
    subjectController.create(req.body, function(err,result){
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

router.get('/:id', function(req, res, next){
    const id = req.params.id;

    subjectController.findById(id, function(err, result){

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