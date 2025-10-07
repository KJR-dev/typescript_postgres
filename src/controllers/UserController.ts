import { NextFunction, Request, Response } from 'express';
import { CreateUserRequest, getByIdUserRequest } from '../types/user';
import { Logger } from 'winston';
import { UserService } from '../services/UserService';

export class UserController {
    constructor(
        private userService: UserService,
        private logger: Logger,
    ) {}
    async create(req: CreateUserRequest, res: Response, next: NextFunction) {
        const { firstName, lastName, email, password, role, tenantId } =
            req.body;
        this.logger.debug('Incoming user data for create', req.body);
        try {
            const user = await this.userService.create({
                firstName,
                lastName,
                email,
                password,
                role,
                tenantId,
            });

            res.status(201).json({ id: user.id });
        } catch (error) {
            next(error);
            return;
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        this.logger.debug('Incoming user data for create', req.body);
        try {
            const { role = '' } = req.query as { role: string };
            const user = await this.userService.getAll(role);
            res.status(201).json(user);
        } catch (error) {
            next(error);
            return;
        }
    }

    async getById(req: getByIdUserRequest, res: Response, next: NextFunction) {
        this.logger.debug('Incoming user data for create', req.body);
        const id = Number(req.params.id);
        try {
            const user = await this.userService.findById(id);
            res.status(200).json(user);
        } catch (error) {
            next(error);
            return;
        }
    }

    async deleteById(
        req: getByIdUserRequest,
        res: Response,
        next: NextFunction,
    ) {
        // this.logger.debug('Incoming user data for create', req.body);
        const id = Number(req.params.id);
        try {
            const user = await this.userService.deleteById(id);
            res.status(204).json(user);
        } catch (error) {
            next(error);
            return;
        }
    }

    async updateById(
        req: CreateUserRequest,
        res: Response,
        next: NextFunction,
    ) {
        const managerData = req.body;
        const id = Number(req.params.id);
        try {
            const user = await this.userService.updateById(id, managerData);
            res.status(204).json(user);
        } catch (error) {
            next(error);
            return;
        }
    }
}
