import { checkSchema } from 'express-validator';

export default checkSchema({
    email: {
        in: ['body'], // Ensures validation applies to req.body
        errorMessage: 'Email is required!',
        notEmpty: {
            errorMessage: 'Email cannot be empty!',
        },
        isEmail: {
            errorMessage: 'Invalid email format!',
        },
    },
});
