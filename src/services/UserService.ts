import { Repository } from 'typeorm';
import { User } from '../entity/User';
import { UserData } from '../types';
import createHttpError from 'http-errors';
import { Roles } from '../constants';
import bcrypt from 'bcrypt';

export class UserService {
    constructor(private userRepository: Repository<User>) {}
    async create({ firstName, lastName, email, password }: UserData) {
        const existUser = await this.userRepository.findOne({
            where: { email: email },
        });

        if (existUser) {
            const err = createHttpError(400, 'Email is already exist');
            throw err;
        }
        const saltRound = 10;
        const hashedPassword = await bcrypt.hash(password, saltRound);
        const user = await this.userRepository.save({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role: Roles.CUSTOMER,
        });
        return user;
    }

    async findByEmail(email: string) {
        return await this.userRepository.findOne({
            where: { email: email },
        });
    }

    async findById(id: number) {
        return await this.userRepository.findOne({
            where: { id },
        });
    }
}
