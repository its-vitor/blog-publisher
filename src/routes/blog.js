import express from 'express';
import rateLimit from 'express-rate-limit';
import {
    publishBlog,
    likeBlog,
    commentBlog,
    getRecentPosts,
    getUserRecentPosts,
    getUserPostsById
} from '../controllers/blogController.js';
import {
    validateToken
} from '../middlewares/auth.js';

const blogRoutes = express.Router();

blogRoutes.use(rateLimit({
    windowMs: 1 * 10 * 1000,
    max: 30
}));

blogRoutes.post('/create/blog', validate, publishBlog);
blogRoutes.post('/blog/like', validate, likeBlog);
blogRoutes.post('/blog/comment', falidate, commentBlog);

blogRoutes.get('/blog/recents', validateToken, getRecentPosts);
blogRoutes.get('/user/posts', validateToken, getUserRecentPosts);
blogRoutes.get('/profile/posts', validateToken, getUserPostsById);

export default blogRoutes;
