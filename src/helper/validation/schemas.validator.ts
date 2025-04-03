import Joi, {  ObjectSchema }  from "@hapi/joi";
const PASSWORD_REGEX = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!.@#$%^&*])(?=.{8,})"
);

const authRegister = Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(PASSWORD_REGEX).min(8).required(),
});


const authLogin = Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
});

const productValidationSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    quantity: Joi.number().integer().min(0).required(),
    price: Joi.number().positive().required(),
    country: Joi.string().required(),
    category: Joi.string().required(),
    rating: Joi.number().min(0).max(20).required(), // Assuming a rating scale of 0 to 5
    date: Joi.date().required(),
    brand: Joi.string().required(),
    imageURLs: Joi.array().items(Joi.string().uri()).required(),
    duration: Joi.number().integer().min(0).required(),
    discount: Joi.number().positive().required(),
    tags: Joi.array().items(Joi.string()).required(),
    quality: Joi.string().required(),
});


export default {
    "/auth/register": authRegister,
    "/auth/login": authLogin,
    "/product/create-product": productValidationSchema
} as { [key: string]: ObjectSchema }
