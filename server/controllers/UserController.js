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
        User.find(params,'id username', function(err, results){
            if(err){
                callback(err, null);
                return;
            }
            callback(null, results);
        })
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
