class CustomError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}

class ImageTypeError extends CustomError {}
class ImageSizeError extends CustomError {}
class DescriptionLengthError extends CustomError {}
class TitleLengthError extends CustomError {}
class AuthorNotFound extends CustomError {}

const Errors = {
    ImageTypeError,
    ImageSizeError,
    DescriptionLengthError,
    TitleLengthError,
    AuthorNotFound
};

export default Errors;
