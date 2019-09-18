const userController = require('../controllers/UserController');
const subjectController = require('../controllers/SubjectController');
const accomController = require('../controllers/AccommodationController');
const Subject = require('../models/Subject');
const Accommodation = require('../models/Accommodation');
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
            });
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
        function retrieveSubjectName(subject_id){
            return new Promise((resolve, reject) => {
                Subject.findById(subject_id,function(err,subject){
                    if (err){
                        reject(err)
                    }
                    resolve(subject.name);
                })
            })
        }

        function retrieveAccomName(accom_id){
            return new Promise((resolve, reject) => {
                Accommodation.findById(accom_id,function(err,accom){
                    if (err){
                        reject(err)
                    }
                    resolve(accom.name);
                })
            })
        }

        const username = req.params.username;

        userController.find({username:username}, function(err, results){
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

        /*
        if (result.length > 0) {

            Promise.all([retrieveAccomName(result[0].accommodation), retrieveSubjectName(result[0].subject)])
                .then(function (values) {
                    //Values should be an array of the results from resolving the promises!
                    let temp_dict = {subject_name: values[1], accom_name: values[0]};
                    let new_res = Object.assign({}, result, temp_dict);
                    res.status(200).json({
                        success: 1,
                        data: new_res
                    });
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).json({
                        success: 0,
                        data: result
                    });
                })
        } else{
            res.status(404).json({
                success: 0,
                data: result
            });
        }
        */
        // if(err){
        //     console.log(err);
        //     res.status(500).json({
        //         success: 0,
        //         data: result
        //     });
        //     return;
        // }
        //
        // let new_res = {};
        // let subj = "None";
        // let accom = "None";
        //
        // console.log("id to be searched for subject",result[0].subject);
        // Subject.findById(result[0].subject,function(err,subject){
        //     console.log("In subj find by ID",subject)
        //     if(err){
        //         console.log(err);
        //         res.status(500).json({
        //             success: 0,
        //         });
        //         subj = "FAILED" + err;
        //     }
        //     subj = subject
        //
        // });
        //
        // accomController.findById(result[0].accommodation,function(err,accommodation){
        //     if(err){
        //         console.log(err);
        //         res.status(500).json({
        //             success: 0,
        //         });
        //         accom = "FAILED" + err;
        //     }
        //     accom = accommodation
        //
        // });

        // console.log("result of subj find by id",subj);
        // new_res = Object.assign({},result[0],{subject_name:subj,accom_name:accom});
        // console.log("NEW RES",new_res);

        // res.status(200).json({
        //     success: 1,
        //     temp: "hey",
        //     data: new_res
        // });
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