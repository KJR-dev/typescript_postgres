import { RequestHandler } from 'express';
import sanitizeHtml from 'sanitize-html';
import { ParsedQs } from 'qs';
import { ParamsDictionary } from 'express-serve-static-core';

/**
 * Sanitizes all string values in a flat object.
 */
function sanitizeFlatObject<T extends Record<string, unknown>>(input: T): T {
    const sanitized = {} as T;

    for (const key in input) {
        const value = input[key];
        sanitized[key] =
            typeof value === 'string'
                ? (sanitizeHtml(value, {
                      allowedTags: [],
                      allowedAttributes: {},
                  }) as T[typeof key])
                : value;
    }

    return sanitized;
}

// Middleware with proper generics for body, params, and query
export const sanitizeXSSMiddleware: RequestHandler<
    ParamsDictionary,
    unknown,
    Record<string, unknown>,
    ParsedQs
> = (req, res, next) => {
    if (req.body && typeof req.body === 'object') {
        req.body = sanitizeFlatObject(req.body);
    }

    if (req.query && typeof req.query === 'object') {
        req.query = sanitizeFlatObject(req.query);
    }

    if (req.params && typeof req.params === 'object') {
        req.params = sanitizeFlatObject(req.params);
    }

    next();
};
