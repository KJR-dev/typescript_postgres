import { checkSchema } from 'express-validator';

export const createSchema = checkSchema({
    name: {
        in: ['body'],
        errorMessage: 'Name is required!',
        trim: true,
        notEmpty: {
            errorMessage: 'Name cannot be empty!',
        },
        matches: {
            options: [/^(?! )[A-Za-z0-9\s]*[A-Za-z][A-Za-z0-9\s]*$/],
            errorMessage:
                'Name must contain at least one letter, can include digits and spaces, and cannot start with a space.',
        },
    },
    address: {
        in: ['body'],
        errorMessage: 'Address name is required!',
        trim: true,
        notEmpty: {
            errorMessage: 'Address cannot be empty!',
        },
        matches: {
            options: [/^(?!\d+$)[A-Za-z0-9,\-\s]+$/],
            errorMessage:
                'Address must contain letters and can include digits, commas, hyphens, and spaces. It cannot be only digits.',
        },
    },
});

export const getByIdSchema = checkSchema({
    id: {
        in: ['params'],
        isInt: true,
        toInt: true,
        errorMessage: 'Id is required and must be a valid number',
    },
});

export const updateByIdSchema = checkSchema({
    id: {
        in: ['params'],
        isInt: true,
        toInt: true,
        errorMessage: 'Id is required and must be a valid number',
    },
    address: {
        in: ['body'],
        errorMessage: 'Address name is required!',
        trim: true,
        notEmpty: {
            errorMessage: 'Address cannot be empty!',
        },
        matches: {
            options: [/^(?!\d+$)[A-Za-z0-9,\-\s]+$/],
            errorMessage:
                'Address must contain letters and can include digits, commas, hyphens, and spaces. It cannot be only digits.',
        },
    },
});
