const Accommodation = require('../models/Accommodation')

module.exports = {

    create: function(params,callback){

        Accommodation.create(params, function(err,result){
            if (err){
                callback(err,null);
                return
            }
            callback(null,result);
        });
    },

    update: function(id,params, callback){
        Accommodation.update({'_id':id},params,function(err,result){
                   if (err){
                callback(err,null);
                return
            }
            callback(null,result);
        });
    },

    find: function(params, callback){
        console.log("IN CONTROLLER AND PARAMS FOLLOW", params);
        Accommodation.find(params,'_id name description capacity students', function(err, results){
            if(err){
                callback(err, null);
                return;
            }
            callback(null, results);
        })
    },

    findById: function(id, callback){
        Accommodation.findById(id, function(err, results){
            if(err){
                callback(err, null);
                return;
            }
            callback(null, results);
        })
    }
}
