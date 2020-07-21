const express = require("express");

const app = express();

const port=3000;

app.get("/", (req, res) =>{
    return res.send("Home Page");
})
app.get("/login", (req, res) =>{
    return res.send("Logged in to the page");
})
app.get("/sanyam", (req, res) =>{
    return res.send("Sanyam was here");
})
app.get("/signout", (req, res) =>{
    return res.send("Sign out");
})
//testing Middle ware by writing trivial functions
const admin= (req, res, next)=>{
    return res.send("This is admin Dashboard");
    next();
}
const isLoggedin = (req, res, next)=>{
    console.log("LOGGED IN CHECK FOR ADMIN...");
    next();
}
const isAdmin = (req, res, next)=> {
    console.log("ADMIN VERIFIED...");
    next();
}
//here isadmin, isloggedin are middle wears and middlewears require next() to jump 
// on to the netx middleware
app.get("/admin", isLoggedin, isAdmin, admin);

app.listen(port, ()=> console.log("Server initiated... "))