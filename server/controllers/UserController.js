const User = require('../models/User')

module.exports = {

    create: function(params,callback){

        User.create(params, function(err,result){
            if (err){
                callback(err,null);
                return
            }
            callback(null,result);
        });
    },

    find: function(params, callback){
        console.log(params);
        //Note the 2nd argument is what to return from finding it!
        User.find(params,'id username subject accommodation', function(err, results){
            if(err){
                callback(err, null);
                return;
            }
            callback(null, results);
        }).populate('subject').populate('accommodation')
    },

    findById: function(id, callback){
        User.findById(id, function(err, results){
            if(err){
                callback(err, null);
                return;
            }
            callback(null, results);
        })
    }
}
