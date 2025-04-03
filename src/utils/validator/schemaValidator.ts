import { NextFunction, Response, Request, RequestHandler } from 'express';
import schemas from '../../helper/validation/schemas.validator';
import { StatusCodes } from 'http-status-codes';
interface ValidationError {
    message: string;
    type: string;
}

interface JoiError {
    status: string;
    error: {
        original: unknown;
        details: ValidationError[];
    };
}


interface CustomError {
    status: string;
    error: string;
}

const supportedMethods = ["post", "put", "patch", "delete"];

const validationOptions = {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: false
};

const schemaValidator = (path: string, useJoiError = true): RequestHandler => {
    const schema = schemas[path];

    if (!schema) {
        throw new Error(`Schema not found for path: ${path}`);
    }

    return (req: Request, res: Response, next: NextFunction) => {
        const method = req.method.toLowerCase();

        if (!supportedMethods.includes(method)) {
            return next();
        }

        const { error, value } = schema.validate(req.body, validationOptions);

        if (error) {
            const customError: CustomError = {
                status: "failed",
                error: "Invalid request. Please review request and try again.",
            };

            const joiError: JoiError = {
                status: "failed",
                error: {
                    original: error.details.length > 0 ? req.body : undefined,
                    details: error.details.map(({ message, type }: ValidationError) => ({
                        message: message.replace(/['"]/g, ""),
                        type,
                    })),
                },
            };

            return res.status(StatusCodes.BAD_REQUEST).json(useJoiError ? joiError : 
customError);
        }
        // validation successful
        req.body = value;
        return next();
    };
};

export default schemaValidator;
