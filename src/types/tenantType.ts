import { Request } from 'express';

export interface ITenant {
    name: string;
    address: string;
}

export interface CreateTenantRequest extends Request {
    body: ITenant;
}
