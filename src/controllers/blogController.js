import { registerBlog, blogModel } from '../models/blog.js'
import { userFromToken } from '../middlewares/auth.js'
import Errors from '../exceptions/errors.js';

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
        await blogModel.updateOne({ _id: blogId }, { $push: { likes: { _id: userFromToken(token) }}})
        res.status(200).json({ 'message': 'Sua curtida foi contabilizada!'})
    } catch (err) {
        res.status(500).json({ 'message': 'Não foi possível encontrar o seu post.' })
    }
};

export const getUserRecentPosts = async (req, res) => {
    const auth = req.headers['authorization'];
    const token = auth && auth.split(' ')[1];
    let { start, size } = req.body;
    try {
        size = parseInt(size);
        start = parseInt(start);
        if (size > 100) return res.status(401).json({ 'message': 'O tamanho da lista não pode ser maior que cem elementos.' });
        const authorId = userFromToken(token);
        const recentPosts = await blogModel.find({ authorId }).sort({ createdAt: -1 }).skip(start).limit(size);
        res.status(200).json({ 'userPosts': recentPosts });
    } catch (err) {
        res.status(500).json({ 'message': 'Ocorreu um erro ao buscar os posts.' });
    }
};

export const getUserPostsById = async (req, res) => {
    let { start, size, userId } = req.body;
    try {
        size = parseInt(size);
        start = parseInt(start);
        if (size > 100) return res.status(401).json({ 'message': 'O tamanho da lista não pode ser maior que cem elementos.' });
        const userPosts = await blog.find({ authorId: userId }).sort({ createdAt: -1 }).skip(start).limit(size);
        res.status(200).json({ 'userPosts': userPosts });
    } catch (err) {
        res.status(500).json({ 'message': 'Ocorreu um erro ao buscar os posts.' });
    }
};


export const getRecentPosts = async (req, res) => {
    let { start, size } = req.body;
    try {
        size = parseInt(size);
        start = parseInt(start);
        if (size > 100) return res.status(401).json({ 'message': 'O tamanho da lista não pode ser maior que cem elementos.' });
        const recentPosts = await blogModel.find().sort({ createdAt: -1 }).skip(start).limit(size);
        res.status(200).json({ 'recentPosts': recentPosts });
    } catch (err) {
        res.status(500).json({ 'message': 'Ocorreu um erro ao buscar os posts.' });
    }
};