import mongoose from 'mongoose';
import sharp from 'sharp';
import * as fileType from 'file-type';
import Errors from '../errors/errors.js';

function createPostModel() {
    const post = new mongoose.Schema({
        title: {
            // título do blog
            type: String,
            required: true,
        },
        description: {
            // descrição do blog
            type: String,
            required: true,
        },
        images: {
            // lista de imagens do blog
            type: [Buffer],
            required: false,
        },
        authorId: {
            // ID do criador daquele post
            type: mongoose.Types.ObjectId,
            required: true,
        }
    });

    /**
     * Evento que é executado quando é criado um novo
     * post. Caso hajam imagens, é verificado se as
     * imagens excedem o tamanho de 10mb, e além disso
     * o tipo delas, visto que apenas jpg, jpeg, png e gif
     * são permitidas.
     * 
     */
    post.pre("save", async function(next) {
        if (!this.isModified(this.images)) return next();

        // operação que verifica cada um dos itens da lista.
        this.images = await Promise.all(this.images.map(async (image) => {

            // redefine as proporções das imagens.
            const buffer = await sharp(image)
                .resize({ width: 500, height: 500, fit: 'inside' })
                .toBuffer();

            // verificação de tamanho e extensão do documento.
            const type = await fileType.fileTypeFromBuffer(buffer);
            if (!['jpg', 'jpeg', 'png', 'gif'].includes(type.ext)) throw new Errors.ImageTypeError('Tipo de imagem inválida.');
            if (buffer.length > 10 * 1024 * 1024) throw new Errors.ImageSizeError('Imagem maior que 10mb.');
            return buffer;
        }));
        next();
    });


    /**
     * Evento que ocorre quando um post é criado.
     * O título não pode exceder 120 caracteres, e a
     * descrição não pode exceder 5000.
     */
    post.pre("save", function(next) {
        // Verificação do tamanho de ambas.
        if (this.description.length > 5000) throw new Errors.DescriptionLengthError('A descrição não deve exceder 5000 caracteres.');
        if (this.title.length > 120) throw new Errors.TitleLengthError('O título não deve exceder 120 caracteres.');
        next();
    });

    post.pre("save", async function(next) {

    });
}