import { Repository } from 'typeorm';
import { User } from '../entity/User';
import { UserData } from '../types';
import createHttpError from 'http-errors';
import { Roles } from '../constants';

export class UserService {
    constructor(private userRepository: Repository<User>) {}
    async create({ firstName, lastName, email, password }: UserData) {
        try {
            const user = await this.userRepository.save({
                firstName,
                lastName,
                email,
                password,
                role: Roles.CUSTOMER,
            });
            return user;
        } catch (err) {
            throw createHttpError(
                500,
                err instanceof Error
                    ? err.message
                    : 'Failed to store the data in the database',
            );
        }
    }
}
