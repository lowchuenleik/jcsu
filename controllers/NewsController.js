const News = require('../models/News')

module.exports = {

    create: function(params,callback){

        News.create(params, function(err,result){
            if (err){
                callback(err,null);
                return
            }
            callback(null,result);
        });
    },

    find: function(params, callback){
        News.find(params,'_id title teaser', function(err, results){
            if(err){
                callback(err, null);
                return;
            }
            callback(null, results);
        })
    },

    findById: function(id, callback){
        News.findById(id, function(err, results){
            if(err){
                callback(err, null);
                return;
            }
            callback(null, results);
        })
    }
}
