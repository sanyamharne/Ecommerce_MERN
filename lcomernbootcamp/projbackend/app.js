// requiering .env files so as to maintain security of the application while hosting it in the real world
//.env files also known as environment variables helps us to hide sensitive information like port address
// paymet gateways etc.
require('dotenv').config()

const mongoose = require('mongoose');
const express= require('express');
const app= express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
//My routes
const authRoutes = require("./routes/auth.js");
const userRoutes= require('./routes/user.js');
const categoryRoutes= require('./routes/category.js');
const productRoutes= require('./routes/product.js');
const orderRoutes= require('./routes/order.js');




// mongoose.connect('mongodb://localhost:27017/tshirt', {useNewUrlParser: true, useUnifiedTopology: true});
// DB connection
mongoose.connect(process.env.DATABASE, {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true
//then used here is a part of javascript it runs when the method called is successfull like in this case
// if the mongoose.connect() method is exectued then 'then()' method will run , in case of failure to run 
// the aforementioned method we can use the catch(), method.
}).then(()=>{
    //to access any variables while printing use backticks(tilde)
    console.log(`DB CONNECTED TO PORT ${port}`);
}).catch(()=>{
    console.log(`DB NOT CONNECTED TO PORT ${port}`);
});

//Middleware
//To use middleware in express application we need to use app.use()
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//MY routes
//since we are using api's we are prefixing all the routes with /api so the signout route beacomes 
//  "/api/signout"
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);



//Ports
const port = process.env.PORT || 8000;

app.listen(port, ()=>{
    console.log(`App is running on ${port}`);
});