const {Order, ProductCart} = require("../models/order");

const {} = require("../controllers/auth");
const {} = require("../controllers/product");
const {} = require("../controllers/user");

//getOrderById
exports.getOrderById =(req, res, next, id)=>{
    
    Order.findById(id)
    .populate("products.product", "name, price")
    .exec((err, order)=>{
        if(err){
            return res.status(400).json({
                error: "cannot get order"
            });
        }
        req.order = order;
        next();
    })
}
//CreateOrder
exports.createOrder = (req, res)=>{
    req.body.order.user = req.profile;
    const order = new Order(req.body.order);
    order.save((err, order)=>{
        if(err){
            return res.status(400).json({
                error: "FAILED TO SAVE THE ORDER IN DB"
            })
        }
        res.json(order);
    })
}

//getAllOrders
exports.getAllOrders = (req, res)=>{
    Order.find()
    .populate("user", "_id name ")
    .exec((err, orders)=>{
        if(err){
            return res.status(400).json({
                error: "Cannot Fetch Orders from DB"
            });
        }
        res.json(orders);
    });
}

//getOrderStatus
exports.getOrderStatus = (req, res)=>{
    res.json(Order.schema.path("status : ").enumValues);
}
//updateStatus
exports.updateStatus = (req, res)=>{
    Order.update(
        {_id : req.body._id},
        {$set : {status : req.body.status}},
        (err, order)=>{
            if(err){
                return res.status(400).json({
                    error: "Cannot Update Order status"
                });
            }
            res.json(order);
        }
    )
}