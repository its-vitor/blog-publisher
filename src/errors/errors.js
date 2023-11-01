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

const Errors = {
    ImageTypeError,
    ImageSizeError,
    DescriptionLengthError,
    TitleLengthError
};

export default Errors;
