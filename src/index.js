import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.js';
import blogRoutes from './routes/blog.js'

dotenv.config();

mongoose.connect(process.env.MONGODB)
    .then(() => console.log('Conexão foi estabelecida.'))
    .catch(err => console.error('Conexão não foi estabelecida. Error: ', err));

const app = express();

app.use(userRoutes);
app.use(blogRoutes);