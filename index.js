const express = require("express");
const cors = require("cors");
require("dotenv").config();
const blog = require("./routes/blog");
const auth = require("./routes/auth");
const connectWithDb = require("./config/database");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());//middleware
app.use(cors());

app.use("/api/v1",blog);//mount
app.use("/api/v1",auth);//mount

connectWithDb();

app.listen(PORT, ()=>{
    console.log(`App is running at Port No. ${PORT}`);
})

app.get("/",(req,res)=>{
    res.send(`<h1>This is Home Page</h1>`)
})