import Joi from 'joi';
import { Roles } from '../constants';

export const registerSchema = Joi.object({
    firstName: Joi.string().trim().min(2).max(30).required().messages({
        'string.base': 'First name must be a string.',
        'string.empty': 'First name cannot be empty.',
        'string.min': 'First name must be at least {#limit} characters long.',
        'string.max': 'First name must be at most {#limit} characters long.',
        'any.required': 'First name is required.',
    }),
    lastName: Joi.string().trim().min(2).max(30).required().messages({
        'string.base': 'Last name must be a string.',
        'string.empty': 'Last name cannot be empty.',
        'string.min': 'Last name must be at least {#limit} characters long.',
        'string.max': 'Last name must be at most {#limit} characters long.',
        'any.required': 'Last name is required.',
    }),
    email: Joi.string().email().trim().required().messages({
        'string.base': 'Email must be a string.',
        'string.empty': 'Email cannot be empty.',
        'string.email': 'Email must be a valid email address.',
        'any.required': 'Email is required.',
    }),
    password: Joi.string()
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/)
        .required()
        .messages({
            'string.base': 'Password must be a string.',
            'string.empty': 'Password cannot be empty.',
            'string.pattern.base':
                'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.',
            'any.required': 'Password is required.',
        }),
    role: Joi.string().trim().valid(Roles.ADMIN).messages({
        'string.base': 'Role must be a string.',
        'any.only': 'Role must be: admin',
        'string.empty': 'Role is required and cannot be empty.',
    }),
});
