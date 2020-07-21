const User = require('../models/user.js');
const Order = require('../models/order.js');



//Using params to get id here id si the parameter
exports.getUserById = (req, res, next, id)=>{
    User.findById(id).exec((err, user)=>{
        if(err || !user){
            return res.status(400).json({
                error: " User does not exist"
            });
        }
        //creating a variable named profile inside the req object and storing the user
        req.profile= user;
        next();
    });
}

exports.getUser = (req, res, next)=>{
    //making sure req.profile doesnt contain sensitive information
    req.profile.salt= undefined;
    req.profile.encry_password= undefined;
    req.profile.createdAt= undefined;
    req.profile.updatedAt= undefined;

    return res.json(req.profile);
    next();
}
//updating Users in the datbase
exports.updateUser= (req, res, next)=>{
    User.findByIdAndUpdate(
        {_id: req.profile._id},
        // req.body is the object passed on by the frontend
        {$set : req.body},
        //mandatory paramenter to pass when we use findByIdAndUpdate
        {new : true, useFindAndModify: false},
        (err, user)=>{
            if(err || !user){
                return res.status(400).json({
                    error: "Failed to update Please login again"
                });
            }
            //hiding sensitive information
            user.salt= undefined;
            user.encry_password= undefined;
            return res.json(user);
        }
    )
};

exports.userPurchaseList=(req, res)=>{
    // we use populate when we want to update a referencing schema(Order model references User model)
    Order.find({User : req.profile._id})
    .populate("user", "_id name")
    .exec((err, order)=>{
        if(err || !order){
            return res.status(400).json({
                error: "No orders Found"
            });
        }
        return res.json(order);
    });
}

//its a middle wear
exports.pushOrderinPurchaseList = (req, res, next)=>{
    $: purchases= [];
    //looping through, 
    req.order.body.products.array.forEach(product => {
        //storing things in th elocal array
        purchases.push({
            _id: product._id,
            name: product.name,
            description: product.description,
            category: product.category,
            quantity: product.quantity,
            amount: req.body.order.amount,
            transaction_id: req.body.order.transaction_id
        });
    });
    //store in the DB
    User.findOneAndUpdate(
        {_id: req.profile._id},
        {$push: {purchases: purchases}},
        {new: true},
        (err, purchaseList)=>{
            if(err || !purchaseList){
                return res.status(400).json({
                    error: "Unable yo update the purchase List"
                })
            }
            next();
        }
        );
    
}
//TODO: Assignment trying to print all the users
// exports.getAllUsers= (req, res, next)=>{
    
//     User.find().exec((err, users)=>{
//         if(err || !users){
//             return  res.send("No Users Found");
//         }
//         return res.json(users);
//     });
    
// }