import { checkSchema } from 'express-validator';

export default checkSchema({
    firstName: {
        in: ['body'],
        errorMessage: 'First name is required!',
        trim: true,
        notEmpty: {
            errorMessage: 'First name cannot be empty!',
        },
        isAlpha: {
            errorMessage: 'First name should be character!',
        },
    },
    lastName: {
        in: ['body'],
        errorMessage: 'Last name is required!',
        trim: true,
        notEmpty: {
            errorMessage: 'Last name cannot be empty!',
        },
        isAlpha: {
            errorMessage: 'Last name should be character!',
        },
    },
    email: {
        in: ['body'],
        errorMessage: 'Email is required!',
        trim: true,
        notEmpty: {
            errorMessage: 'Email cannot be empty!',
        },
        isEmail: {
            errorMessage: 'Invalid email format!',
        },
    },
});
