const express = require("express");
const router = express.Router();

const {isAdmin, isAuthenticated, isSignedIn}= require("../controllers/auth.js");
const {getUserById}= require("../controllers/user.js");
const {getCategoryById, createCategory, getCategory, getAllCategory, updateCategory, deleteCategory}= require("../controllers/category.js");

//creating params for userid and categroyid
router.param("userId", getUserById);
router.param("categoryId", getCategoryById);

//Routes
// read
router.post("/category/create/:userId", isSignedIn, isAuthenticated, isAdmin, createCategory);
router.get("/category/:categoryId", getCategory);
router.get("/categories", getAllCategory);

//update
router.put("/category/:categoryId/:userId", isSignedIn, isAuthenticated, isAdmin, updateCategory);

//delete
router.delete("/category/:categoryId/:userId", isSignedIn, isAuthenticated, isAdmin, deleteCategory);


module.exports=router;