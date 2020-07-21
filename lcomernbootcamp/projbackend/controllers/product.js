const Product= require('../models/product.js');
const formidable = require("formidable");
//importng file System
const fs = require("fs");
// we use _ so that a variables use can be restricted
const _ = require("lodash");
const product = require('../models/product.js');
const { sortBy } = require('lodash');


//getProductByid
exports.getProductById = (req, res, next, id)=>{
    Product.findById(id)
    .populate("category")
    .exec((err, prod)=>{
        if(err || !prod){
            return res.status(400).json({
                error : "Product not found"
            })
        }
        req.product= prod;
        next(); 
    })
}

//createProduct
exports.createProduct = (req, res)=>{
    let form = new formidable.IncomingForm();
    form.keepExtensions= true;

    form.parse(req, (err, fields, file)=>{
        if(err){
            //error usually occurs with files than fields as a custom message for fields can be included in the routes
            Error: "Cannot parse the image(File)"
        }
        //destructuring the fields
        const {name, price, description, category, stock, photo} = fields;
        

        // restrictions on filed
        //TODO: Can also be done using express vcalidators in routes check auth.js(routes)
        if(
            !name ||
            !price ||
            !description ||
            !category ||
            !stock 
        ){
            // console.log(fields);
            return res.status(400).json({
                error : "All fields are compulsory"
            });
        }
        //handling fileds
        let product = new Product(fields);

        //handling files
        if(file.photo){
            if(file.photo.size > 3000000){
                return res.json({
                    Error: "File size too big!"
                })
            }
            //instering into Product model
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }

        //saving to DB
        product.save((err, prod)=>{
            if(err){
                return res.status(400).json({
                    Error: "Unable to save"
                })
            }
            res.json(product)
        })
    })
}

//getProduct
exports.getProduct = (req, res)=>{
    //Inorder to make the process fast to load form-data such as mp3 or imgaes we do this (check getPhoto)
    req.product.photo = undefined;
    return res.send(req.product);
}
//getPhoto middleware for optimization of loading photos
exports.getPhoto = (req, res, next)=>{
    if(req.product.photo.data){
        res.set("Content-Type", req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
}

//Delete
exports.deleteProduct = (req, res)=>{
    const product = req.product;
    product.remove((err, deletedProduct)=>{
        if(err){
            return res.status(400).json({
                error: "Unable to Delete"
            });   
        }
        res.json({
            message: "Successfully Deleted",
            deletedProduct
        });
    });
}

//Update different than category update since we are dealing with formdata
exports.updateProduct = (req, res)=>{
    let form = new formidable.IncomingForm();
    form.keepExtensions= true;

    form.parse(req, (err, fields, file)=>{
        if(err){
            //error usually occurs with files than fields as a custom message for fields can be included in the routes
            Error: "Cannot parse the image(File)"
        }
       
        //updating fields using lodash( _ ) ".extend is a lodash method"
        let product = req.product;
        product = _.extend(product, fields);

        //handling files
        if(file.photo){
            if(file.photo.size > 3000000){
                return res.json({
                    Error: "File size too big!"
                })
            }
            //instering into Product model
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }

        //saving to DB
        product.save((err, prod)=>{
            if(err){
                return res.status(400).json({
                    Error: "Unale to update"
                })
            }
            res.json({
                message: "Product Updated",
                product
            })
        })
    })

}

//getAllproducts
exports.getAllProducts = (req, res)=>{
    let limit = req.query.limit ? req.query.limit : 8;
    let sortBy = req.query.sort ? req.query.sort : "_id";
    Product.find()
    .select("-photo")
    .sort([[sortBy, "asc"]])
    // another example  could be
    // .sort([["updateAt", "descending"]])
    .limit(limit)
    .populate("category")
    .exec((err, products)=>{
        if(err){
            return res.status(400).json({
                error: "No Product Found"
            });
        }
        res.json(products);
    });
}

//Middleware to update Stocks and Sold after the products are added to the cart
exports.updateStock = (req, res, next)=>{
    //.map() iterates through all the products in the cart
    let myOperations= req.body.order.products.map(prod=>{
        return {
            updateOne:{
                //finding the product using the _id
                filter: {_id : prod._id},
                //the prod.count is thrown by the front end
                update: {$inc : {stock: -prod.count , sold: +prod.count}}
            }
        }
    })
    //bulkwrite is used to handle operations in bulk by Mongoose Read the Documentation for more info
    product.bulkWrite(myOperations, {}, (err, products)=>{
        if(err){
            return res.status(400).json({
                error: "Bulk Operation failed"
            })
        }
        next();
    })
    
    
}

//getting all Unique Categories
//This method can also be written in the categories controller
exports.getAllUniqueCategories =()=>{
    //distinct gets all the unique items from the tuple
    Product.distinct("category", {}, (err, categories)=>{
        if(err){
            return res.status(400).json({
                error: "FAILED TO GET CATEGORY"
            });
        }
        res.json(categories);
    })
}