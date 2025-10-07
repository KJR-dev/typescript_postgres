import Joi from 'joi';

export const authSchema = Joi.object({
    email: Joi.string()
        .trim()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
            'string.empty': 'Email is required',
            'string.email': 'Email should be a valid email address',
        }),

    password: Joi.string().trim().required().messages({
        'string.empty': 'Password is required!',
    }),
});
