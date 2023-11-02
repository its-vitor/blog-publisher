import { registerBlog, blog } from '../models/blog.js'
import { userFromToken } from '../middlewares/auth.js'
import Errors from '../exceptions/errors.js';
import mongoose from 'mongoose';

export const publishBlog = async (req, res) => {
    const auth = req.headers['authorization'];
    const token = auth && auth.split(' ')[1];
    const { title, description, images } = req.body

    const _id = userFromToken(token);
    try {
        const blog = await registerBlog(title, description, images, _id);
        res.status(200).json({'message': 'Seu blog foi publicado!', 'blogId': blog._id});
    } catch (err) {
        if (err instanceof Errors.ImageTypeError) {
            res.status(400).json({ 'message': 'Tipo de imagem inválida.' });
        } else if (err instanceof Errors.ImageSizeError) {
            res.status(400).json({ 'message': 'Sua imagem não pode exceder 10MB.' });
        } else if (err instanceof Errors.DescriptionLengthError) {
            res.status(400).json({ 'message': 'A descrição não deve exceder 5000 caracteres.' });
        } else if (err instanceof Errors.TitleLengthError) {
            res.status(400).json({ 'message': 'O título não deve exceder 120 caracteres.' });
        } else {
            res.status(500).json({ 'message': 'Ocorreu um erro ao publicar seu blog.' });
        }
    }
};

export const likeBlog = async (req, res) => {
    const auth = req.headers['authorization'];
    const token = auth && auth.split(' ')[1];
    const { blogId } = req.body

    try {
        await blog.updateOne({ _id: blogId }, { $push: { likes: { _id: userFromToken(token) }}})
        res.status(200).json({ 'message': 'Sua curtida foi contabilizada!'})
    } catch (err) {
        res.status(500).json({ 'message': 'Não foi possível encontrar o seu post.' })
    }
};

export const commentBlog = async (req, res) => {
    const auth = req.headers['authorization'];
    const token = auth && auth.split(' ')[1];
    const { blogId, content } = req.body

    try {
        await blog.updateOne({ _id: blogId }, { $push: { comments: { authorId: userFromToken(token), content: content } } });
        res.status(200).json({ 'message': 'Seu comentário foi publicado!' });
    } catch (err) {
        res.status(500).json({ 'message': 'Não foi possível encontrar o seu post.' });
    }
};