var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
const FKHelper = require('../helpers/foreign_key_helper');

var SALT_WORK_FACTOR = 10;

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        index: { unique: true },
        required: true,
        unique: true,
    },
    // password: String,
    created: {
        type: Date,
        required: true,
        default: new Date()
    },
    id:{
        type: String,
    },
    subject: {type:mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        validate:{
            isAsync: true,
            validator: function(x) {
                return FKHelper(mongoose.model('User',x));
            },
            message: 'Subject does not exist'
        }
    },
    accommodation: {type:mongoose.Schema.Types.ObjectId,
        ref: 'Accommodation',
        validate:{
            isAsync: true,
            validator: function(x) {
                return FKHelper(mongoose.model('User',x));
            },
            message: 'Accommodation does not exist'
        }
    }
});

// UserSchema.methods.comparePassword = function comparePassword(password, callback) {
//      bcrypt.compare(password, this.password, callback);
// };

// On save, hash the password but not now as we use raven

// UserSchema.pre('save', function saveHook(next) {
//     var user = this;
//
//     if(!user.isModified('password')){
//         return next();
//     }
//
//     return bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
//         if(err){ return next(err); }
//
//         return bcrypt.hash(user.password, salt, function(hashError, hash){
//             if(hashError){
//                 return next(hashError);
//             }
//             user.password = hash;
//             return next();
//         });
//     });
// });

// Validator runs on every model.save!
// User.findOneAndUpdate({ _id: id }, { $set: setObject }, { new: true, runValidators: true });


module.exports = mongoose.model('User', UserSchema);