const Subject = require('../models/Subject')
const User = require('../models/User')

module.exports = {

    create: function(params,callback){

        Subject.create(params, function(err,result){
            if (err){
                callback(err,null);
                return
            }
            callback(null,result);
        });
    },

    find: function(params, callback){
        Subject.find(params,'_id name description residents', function(err, results){
            if(err){
                callback(err, null);
                return;
            }
            callback(null, results);
        })
    },

    findById: function(id, callback){
        Subject.findById(id, function(err, results){
            if(err){
                callback(err, null);
                return;
            }
            callback(null, results);
        })
    },

    findStudents: function(subject_id, callback){
        //Note the 2nd argument is what to return from finding it!
        console.log("findstudents id",subject_id);
        User.find(subject_id,'name username subject accommodation', function(err, results){
            if(err){
                callback(err, null);
                return;
            }
            callback(null, results);
        }).populate('subject').populate('accommodation')
    },

}
