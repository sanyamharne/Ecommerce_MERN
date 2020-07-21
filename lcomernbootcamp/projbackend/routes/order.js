const express = require("express");
const router = express.Router();

const {
    getOrderById, 
    createOrder,
    getAllOrders,
    updateStatus,
    getOrderStatus
} = require("../controllers/order.js");
const {isSignedIn, isAuthenticated, isAdmin}= require("../controllers/auth.js");
const {getUserById, pushOrderinPurchaseList}= require("../controllers/user.js");
const {updateStock} = require("../controllers/product");

//params
router.param("orderId", getOrderById);
router.param("userId", getUserById);

//ROUTES
//create
router.get("order/create/:userId", isSignedIn, isAuthenticated, pushOrderinPurchaseList, updateStock, createOrder);
//read for all the orders
router.get("order/all/:userId", isSignedIn, isAuthenticated,isAdmin, getAllOrders);

//Order-Status ROUTES
router.get("order/status/:userId", isSignedIn, isAuthenticated, isAdmin, getOrderStatus);
router.put("order/:orderId/status/:userId", isSignedIn, isAuthenticated, isAdmin, updateStatus);
module.exports = router;