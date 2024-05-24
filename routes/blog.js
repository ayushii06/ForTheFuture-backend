const express = require("express");
const router = express.Router();

//Import Controllers

const {createBlog, getAllBlogs} = require("../controllers/blogController");

router.post("/blogs/create",createBlog);

router.get("/blogs/getblog",getAllBlogs);

//export
module.exports = router;
