var express = require('express');
var router = express.Router();  
//importing logics from controllers
const {signout, signup, signin, isSignedIn}= require("../controllers/auth.js");
//importing check from express-validator
const {check, validationResult}= require('express-validator');
// methods or logic inside the routers should be written in controllers

//signup
router.post('/signup', [
    //Signup Validtaion for password, email and names
    //withMessage is a custom message for the validator
    check("name").isLength({ min: 3}).withMessage("Name must be atleast 3 characters long"),
    check("email").isEmail().withMessage("Provide a valid email"),
    check("password").isLength({min: 3}).withMessage("Password must be atleast 3 characters long")
], 
//The following is a signup controller
signup
);
//SIGNIN
router.post('/signin', [
    //Signin Validtaion for password, email 
    check("email").isEmail().withMessage("Provide a valid email"),
    check("password").isLength({min: 1}).withMessage("Password is Compulsory ")
], signin//this is a signin controller
);
//signout
router.get('/signout', signout);

//protected routes for authorized personell only
router.get('/test', isSignedIn, (req, res)=>{
    res.json(req.auth);
});

module.exports = router;