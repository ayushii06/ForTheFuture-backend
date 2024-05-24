const Post = require('../models/blogModel');
const User = require('../models/user');

// Create a new post
exports.createPost = async (req, res) => {
    try {
        const { content } = req.body;
        const newPost = new Post({ user: req.user.id, content });
        const savedPost = await newPost.save();
        res.status(201).json({
            success:true,
            savedPost,
        })
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Like or unlike a post
exports.likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        if (post.likes.includes(req.user.id)) {
            post.likes.pull(req.user.id);
        } else {
            post.likes.push(req.user.id);
        }
        await post.save();
        const updatedPost = await post.populate('likes', 'username');
        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Comment on a post
exports.commentOnPost = async (req, res) => {
    try {
        const postId = req.params.postId;
        
        // Find the post by ID
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Create the new comment
        const newComment = {
            user: req.user.id,
            text: req.body.text
        };

        // Add the new comment to the post's comments array
        post.comments.push(newComment);

        // Save the updated post
        await post.save();

        // Refetch the post with populated comments
        const updatedPost = await Post.findById(postId).populate('comments.user', 'username');

        // Return the updated post with populated comments
        res.status(201).json(updatedPost);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all posts
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('user', 'username').populate('comments.user', 'username');
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
