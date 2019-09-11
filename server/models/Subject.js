const mongoose = require('mongoose');
const FKHelper = require('../helpers/foreign_key_helper');

const SubjectSchema = new mongoose.Schema({
    name: {type:String,unique:true},
    description: String,
    ranking: {
        type: Number,
        default: 1
      },
    created: {
        type: Date,
        required: true,
        default: new Date()
    },
    students: [{type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        validate:{
            isAsync: true,
            validator: function(x) {
                return FKHelper(mongoose.model('User'),x);
            },
            message: 'User does not exist'
        }
    }]
});

mongoose.model('Subject', SubjectSchema);

module.exports = mongoose.model('Subject');