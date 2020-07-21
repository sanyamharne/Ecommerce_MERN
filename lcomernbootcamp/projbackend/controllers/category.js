const User= require('../models/user.js');
const Category= require('../models/category.js');
// const category = require('../models/category.js');
// const { delete } = require('../routes/category.js');


exports.getCategoryById = (req, res, next, id)=>{
    
    Category.findById(id).exec((err, cat)=>{
        if(err || !cat){
            return res.status(400).json({
                error: "Categroy not found in the DB"
            })
        }
        //storing category in the req variable
        req.category = cat;
        next();
    })
}

//Create Category
exports.createCategory=(req, res)=>{
    const cat = new Category(req.body);
    cat.save((err, category)=>{
        if(err || !category){
            error : "Unable to save Category in the DB"
        }
        return res.json({cat})
    })
}

//getCategory
exports.getCategory= (req, res, id)=>{
    // req.category initiated by the params
    Category.findById(id).exec((err, category)=>{
        if(err || !category){
            error : "No such category found "
        }
        return res.json(req.category);

    })
}

//getAllCategory
exports.getAllCategory = (req, res)=>{
    Category.find().exec((err, categories)=>{
        if(err || !categories){
            error: "No categories found in DB"
        }
        return res.json(categories);
    })
}

//update Category
exports.updateCategory=(req, res)=>{
    const category= req.category;
    category.name= req.body.name;

    category.save((err, updatedCategory)=>{
        if(err || !updatedCategory){
            error: "Failed to update Category"
        }
        res.json(updatedCategory);
    });
}

// deleteCategory
exports.deleteCategory = (req, res)=>{
    const category = req.category;
    category.remove((err, deletedCategory)=>{
        if(err || !deletedCategory){
            error: "Unable to delete Categroy from DB"
        }
        return res.json({
            Message: `${deletedCategory} Deleted from DB`
        })
    })
}