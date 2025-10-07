import { Request } from 'express';

export interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
    tenantId: number;
}

export interface UserId {
    id: number;
}

export interface CreateUserRequest extends Request {
    body: UserData;
}

export interface getByIdUserRequest extends Request {
    body: UserId;
}
