import express from 'express';
import rateLimit from 'express-rate-limit';
import { publishBlog, likeBlog, commentBlog } from '../controllers/blogController.js';

const blogRoutes = express.Router();

blogRoutes.use(rateLimit({
    windowMs: 1 * 10 * 1000,
    max: 30
  }));

blogRoutes.post('/create/blog', publishBlog);
blogRoutes.post('/blog/like', likeBlog);
blogRoutes.post('/blog/comment', commentBlog)

export default blogRoutes;