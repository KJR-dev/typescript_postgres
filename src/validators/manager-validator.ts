import Joi from 'joi';
import { Roles } from '../constants';
import { GetAllManagerQuery, GetByIdManagerParams } from '../types/manager';

export const createManagerSchema = Joi.object({
    firstName: Joi.string()
        .trim()
        .pattern(/^[A-Za-z]+$/)
        .required()
        .messages({
            'string.empty': 'First name is required and cannot be empty.',
            'string.pattern.base': 'First name must contain only letters.',
        }),

    lastName: Joi.string()
        .trim()
        .pattern(/^[A-Za-z]+$/)
        .required()
        .messages({
            'string.empty': 'Last name is required and cannot be empty.',
            'string.pattern.base': 'Last name must contain only letters.',
        }),

    email: Joi.string().trim().email().required().messages({
        'string.empty': 'Email is required and cannot be empty.',
        'string.email': 'Email must be a valid email address.',
    }),

    password: Joi.string()
        .trim()
        .required()
        .min(8)
        .pattern(/[A-Z]/, 'uppercase')
        .pattern(/[a-z]/, 'lowercase')
        .pattern(/[0-9]/, 'number')
        .pattern(/[^A-Za-z0-9]/, 'symbol')
        .messages({
            'string.empty': 'Password is required and cannot be empty.',
            'string.min': 'Password must be at least 8 characters.',
            'string.pattern.name':
                'Password must include at least one {#name} character.',
        }),
    role: Joi.string().trim().valid(Roles.MANAGER).required().messages({
        'string.base': 'Role must be a string.',
        'any.only': 'Role must be: manager',
        'string.empty': 'Role is required and cannot be empty.',
    }),
    tenantId: Joi.number().integer().positive().required().messages({
        'number.base': 'Tenant ID must be a number.',
        'number.integer': 'Tenant ID must be an integer.',
        'number.positive': 'Tenant ID must be a positive number.',
        'any.required': 'Tenant ID is required.',
    }),
});

export const getAllManagerSchema = Joi.object<GetAllManagerQuery>({
    role: Joi.string()
        .valid(Roles.ADMIN, Roles.MANAGER, Roles.CUSTOMER)
        .required(),
});

export const getByIdManagerSchema = Joi.object<GetByIdManagerParams>({
    id: Joi.number().integer().positive().min(1).required(),
});

export const updateManagerSchema = Joi.object({
    firstName: Joi.string()
        .trim()
        .pattern(/^[A-Za-z]+$/)
        .required()
        .messages({
            'string.empty': 'First name is required and cannot be empty.',
            'string.pattern.base': 'First name must contain only letters.',
        }),

    lastName: Joi.string()
        .trim()
        .pattern(/^[A-Za-z]+$/)
        .required()
        .messages({
            'string.empty': 'Last name is required and cannot be empty.',
            'string.pattern.base': 'Last name must contain only letters.',
        }),

    email: Joi.string().trim().email().required().messages({
        'string.empty': 'Email is required and cannot be empty.',
        'string.email': 'Email must be a valid email address.',
    }),

    role: Joi.string().trim().valid(Roles.MANAGER).required().messages({
        'string.base': 'Role must be a string.',
        'any.only': 'Role must be: manager',
        'string.empty': 'Role is required and cannot be empty.',
    }),
    tenantId: Joi.number().integer().positive().required().messages({
        'number.base': 'Tenant ID must be a number.',
        'number.integer': 'Tenant ID must be an integer.',
        'number.positive': 'Tenant ID must be a positive number.',
        'any.required': 'Tenant ID is required.',
    }),
});
