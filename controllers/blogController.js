const Blog = require("../models/blogModel");
const Tag = require("../models/tagModel");
var ObjectId = require('mongoose').Types.ObjectId;

exports.createBlog = async (req,res)=>{
    try{
        const {body,user} = req.body;
        const blog = new Blog({
            body,user
        })
        const savedBlog = await blog.save();

        const recentBlog = await Blog.find().sort({"_id": -1}).limit(1);
        const recentBlogJson = recentBlog[0];

        const recentBlogTag = recentBlogJson.tag;

        const existingTag = await Tag.findOne({title:recentBlogTag});

        let newTag = {};
        if(existingTag){
            newTag = await Tag.findByIdAndUpdate({_id:existingTag._id},{$push:{blogs:recentBlogJson._id}},{new:true});
        }
        else{
            const createdTag = new Tag({
                title:recentBlogTag, 
                blogs:[recentBlogJson._id]
            })
            newTag = await createdTag.save();
        }
        
        return res.status(200).json({
            success:true,
            message:'Blog created Successfully',
            blog: savedBlog,
            tag: newTag,
        })
    }
    catch(error){
        return res.status(400).json({
            success:false,
            message:"Error while creating blog",
            error:error.message,
        })
    }
};

exports.getAllBlogs = async (req,res)=>{
    
    try{
        const tag = req.query.tag;
        const hashtag = req.query.hashtag;
        const blogId = req.query.blogId;
        const newBlogId = new ObjectId(blogId);
        

        if(!tag && !hashtag && !blogId){
            // const blogs = await Blog.find();
            //
            let {page} = req.query;
            page = parseInt(page,10)||1;
            const pageSize = 10;
            const blogsdata = await Blog.aggregate([
                {
                  $facet: {
                    metadata: [{ $count: 'totalCount' }],
                    data: [{ $skip: (page - 1) * pageSize }, { $limit: pageSize }],
                  },
                },
              ]);
              
              const blogs = blogsdata[0].data;
              const totalCount = blogsdata[0].metadata[0].totalCount;
              
            
            const totalPages = Math.ceil(totalCount/pageSize);
            return res.status(200).json({
                page,
                pageSize,
                totalPages,
                blogs,                  
            })
        }
        else if(tag){
            const blogsdata = await Tag.findOne({title:tag}).populate({path: 'blogs'});
            const blogs = blogsdata.blogs;
            return res.status(200).json({
                success:true,
                message:'Blogs related to tag fetched successfully',
                blogs,
            })
        }
        else if(hashtag){
            let {page} = req.query;
            page = parseInt(page,10)||1;
            // console.log(page);
            const pageSize = 10;
            // const blogs = await Blog.find({hashtag:hashtag}).skip(pageSize * (page-1))
            // .limit(pageSize)
            const blogsdata = await Blog.aggregate([
                {$match : {hashtag:hashtag}},
                {
                    $facet: {
                      metadata: [{ $count: 'totalCount' }],
                      data: [{ $skip: (page - 1) * pageSize }, { $limit: pageSize }],
                    },
                  },
            ])
            const blogs = blogsdata[0].data;
            const totalCount = blogsdata[0].metadata[0].totalCount;
            return res.status(200).json({
                page,
                pageSize,
                totalCount,
                blogs,                  
            }); 
        } 
        else if(blogId){
            const blog = await Blog.findById(newBlogId);
            const tag = blog.tag;
            const relatedTagData = await Tag.findOne({title:tag}).populate({path: 'blogs'});
            const relatedTag = relatedTagData.blogs;
            return res.status(200).json({
                success:true,
                message:'Blog Page fetched Successfully',
                blog,
                relatedTag
            })
        }       
    }
    catch(error){
        console.log(error.message)
        return res.status(400).json({
            error:"Error while fetching Blogs",
            message:error.message
        })
    }
}