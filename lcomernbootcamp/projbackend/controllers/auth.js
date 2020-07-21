//Keep in mind to give the same name to the controller as that of routes
const User= require('../models/user.js');
const {check, validationResult}= require('express-validator');
//importing to create tokens
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

//SIGNUP
exports.signup=(req, res)=>{

    const errors= validationResult(req);
    //if the errors object is empty then the check was validated
    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()[0].msg,
            //Param: errors.array()[0].param
        })
    }
    //req.body is accepted by body-parser
    const user = new User(req.body);
    user.save((err, user)=>{
        if(err) {
            return res.status(400).json({
            err: "NOT ABLE TO SAVE USER IN DB"
        })};
        res.json({
            name: user.name,
            email: user.email,
            id: user._id
        });
    });
};


//SIGN IN
exports.signin=(req, res) =>{
    const errors= validationResult(req);
    //Retrieving email and password
    const {email, password}= req.body;
    //Check for Validation
    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()[0].msg,
            //Param: errors.array()[0].param
        })
    }
    
    //findOne finds the first entry in the dataase and a call back function is 
    // called to access the found user
    User.findOne({email}, (err, user)=>{
        //if no email is found in the database
        if(err){
            return res.status(400).json({
                error: "USER EMAIL DOES NOT EXIST"
            });
        }
        //if user doesnt exist
        if(!user){
            return res.status(400).json({
                error: "USER HAS NOT SIGNED UP"
            })
        }
        //if users pass doesnt match
        if(!user.authenticate(password)){
            return res.status(401).json({
                error: "Email or Password Do not Match"
            });
        }
        //Status(200) Email and pass match and the user is already registered.
        //Creating a token 
        const token = jwt.sign({_id: user._id }, process.env.SECRET);
        //Putting the token in a cookie named token
        res.cookie("token", token, {expire: new Date()+9999});
        //Sending response to front end
        const {_id, name, email, role} = user;
        return res.json({
            token,
            user: {_id, name, email, role}
        });

    });
};


//SIGN OUT
exports.signout= (req, res)=> {
    //clear the cookie whose name is token
    res.clearCookie("token");
    res.json({
        message: "USER SIGNED OUT SUCCESSFULLY"
    });
};

//protected routes
//express-jwt uses 'Bearer' for authorization
exports.isSignedIn=expressJwt({
    secret: process.env.SECRET,
    userProperty: "auth"
});

//Custom middleware requires next whereas api's have next() built in
exports.isAuthenticated = (req, res, next)=>{
    let checker = req.profile && req.auth && req.auth._id == req.profile._id;
    if(!checker){
        return res.status(403).json({
            error: `Access Denied at auth controller`
        })
    }
    next();
}
//isAdmin
exports.isAdmin = (req, res, next)=>{
    if(req.profile.role === 0)
    return res.status(403).json({
        error: "Not Admin, Access Denied"
    })
    next();
}