var mongoose = require('mongoose');
const crypto = require('crypto');
const uuidv1 = require('uuid/v1');
// var Schema = mongoose.Schema;
 var userSchema = new mongoose.Schema({
    name: {
        type: String,
        maxlength: 32,
        required: true,
        trim: true
    },

    lastname: {
        type: String,
        maxlength: 32,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    userinfo: {
        type: String,
        trim: true 
    },
     //TODO: come back here
    encry_password: {
        type: String,
        require: true
    },
    // salt is used for cryptography of passwords 
    salt: String,

    role:{
         type: Number,
         default: 0
        },

    purchases:{
        type: Array,   
        default: []
    } 
},
//timetsamps store the timestamp of any activity in the database
{timestamps: true}
);
//creating virtuals for 
userSchema.virtual("password")
    .set(function(password){
        this._password= password;
        this.salt= uuidv1();//getting a uuid for encryption
        this.encry_password= this.securePassword(password);
    })
    .get(function(){
        // returning the plain password just in case anyone needs it in the future
        return this._password;
    });
//Creating a method to encrypt passwords
userSchema.methods ={

    // Authentication of user
    authenticate : function(plainpassword){
        return this.securePassword(plainpassword) === this.encry_password;

    },
     //Creating a method to encrypt passwords
    securePassword: function(plainpassword){
        if(!plainpassword) return "";
        try{
            //encrypting the password using crypto node_module
            return crypto.createHmac('sha256', this.salt)
            .update(plainpassword)
            .digest('hex');
        }
        catch (err){
             return "";
        }
    }
};

 // exporting the schema inshort keeping the code private
 module.exports = mongoose.model("User", userSchema);