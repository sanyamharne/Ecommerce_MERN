var express = require('express');
var router = express.Router(); 
//importing methods(logics) from controllers
const { getUserById, getUser , updateUser, userPurchaseList}= require("../controllers/user.js");
const { isSignedIn, isAuthenticated }= require("../controllers/auth.js");

router.param("userId", getUserById);

router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);
//updating DB routes
router.put("/user/:userId", isSignedIn, isAuthenticated, updateUser);
//populate in moongoose for usersPurchaseList
router.put("/orders/user/:userId", isSignedIn, isAuthenticated, userPurchaseList);


//TODO: Assignment delete later
//router.get("/users", getAllUsers);




//exporting the routers so that they can be accessed in app.js
module.exports= router;