const express = require("express");
const cors = require("cors");
require("dotenv").config();
const blog = require("./routes/blog");
const auth = require("./routes/auth");
const connectWithDb = require("./config/database");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());//middleware
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Access-Control-Allow-Origin');

    // Pass to next layer of middleware
    next();
});

app.use("/api/v1",blog);//mount
app.use("/api/v1",auth);//mount

connectWithDb();

app.listen(PORT, ()=>{
    console.log(`App is running at Port No. ${PORT}`);
})

app.get("/",(req,res)=>{
    res.send(`<h1>This is Home Page</h1>`)
})