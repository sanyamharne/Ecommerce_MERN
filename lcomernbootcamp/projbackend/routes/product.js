const express = require("express");
const router = express.Router();
//importing controllers
const {
    getProductById,
    createProduct,
    getProduct, 
    getPhoto, 
    deleteProduct, 
    updateProduct,
    getAllProducts,
    getAllUniqueCategories
} = require('../controllers/product.js')
const {isSignedIn, isAuthenticated, isAdmin}= require("../controllers/auth.js");
const {getUserById}= require("../controllers/user.js");



//params getProductById
router.param("userId", getUserById);
router.param("productId", getProductById);

//Routes
//Create
router.post("/product/create/:userId", isSignedIn, isAuthenticated, isAdmin, createProduct);


//Read routes
//getProducts & getPhoto
router.get("/product/:productId", getProduct);
router.get("/product/photo/:productId", getPhoto);


//Delete routes
router.delete("/product/:productId/:userId", isSignedIn, isAuthenticated, isAdmin, deleteProduct);


//Update routes
router.put("/product/:productId/:userId", isSignedIn, isAuthenticated, isAdmin, updateProduct); 

//listing routes
router.get("/products", getAllProducts);
//getting AllCategories
router.get("/product/categories", getAllUniqueCategories);


//exporing all the routes
module.exports = router;

