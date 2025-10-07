import { Request, Response, NextFunction, RequestHandler } from 'express';

type Scope = 'query' | 'body' | 'params';

type AllowedFieldsMap = {
    query?: string[];
    body?: string[];
    params?: string[];
};

const getScopeData = (req: Request, scope: Scope): Record<string, unknown> => {
    if (scope === 'query') return req.query as Record<string, unknown>;
    if (scope === 'body') return req.body as Record<string, unknown>;
    return req.params as Record<string, unknown>;
};

export const rejectUnexpectedFields =
    (allowedFields: AllowedFieldsMap): RequestHandler =>
    (req: Request, res: Response, next: NextFunction): void => {
        const scopes: Scope[] = ['query', 'body', 'params'];

        for (const scope of scopes) {
            const allowed = allowedFields[scope] || [];
            const actual = Object.keys(getScopeData(req, scope));
            const extra = actual.filter((key) => !allowed.includes(key));

            if (extra.length > 0) {
                res.status(400).json({
                    success: false,
                    message: `Unexpected field(s) in '${scope}': ${extra.join(', ')}`,
                });
                return;
            }
        }

        next();
    };
