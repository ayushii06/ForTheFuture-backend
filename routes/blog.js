const express = require('express');
const router = express.Router();
const postController = require('../controllers/blogController');
const authMiddleware = require('../middleware/authMiddleware');

// Create a post
router.post('/posts', authMiddleware, postController.createPost);

// Like or unlike a post
router.put('/posts/:postId/like', authMiddleware, postController.likePost);

// Comment on a post
router.post('/posts/:postId/comment', authMiddleware, postController.commentOnPost);

// Get all posts
router.get('/posts', postController.getAllPosts);

module.exports = router;
