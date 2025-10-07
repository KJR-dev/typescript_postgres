// utils/sanitize.ts
import sanitizeHtml from 'sanitize-html';

export const sanitizeInput = (value: string): string => {
    return sanitizeHtml(value, {
        allowedTags: [], // remove all HTML tags
        allowedAttributes: {}, // remove all attributes
    });
};
