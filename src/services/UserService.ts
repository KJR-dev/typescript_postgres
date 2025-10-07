import { FindOptionsWhere, Repository } from 'typeorm';
import { User } from '../entity/User';
import { UserData } from '../types/auth';
import createHttpError from 'http-errors';
import { Roles } from '../constants';
import bcrypt from 'bcrypt';
import { UserUpadateData } from '../types/user';
import { Tenant } from '../entity/Tenant';

export class UserService {
    constructor(private userRepository: Repository<User>) {}
    async create({
        firstName,
        lastName,
        email,
        password,
        role,
        tenantId,
    }: UserData) {
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
            role: role ?? Roles.CUSTOMER,
            tenant: tenantId ? { id: tenantId } : undefined,
        });
        return user;
    }

    async findByEmail(email: string) {
        return await this.userRepository.findOne({
            where: { email: email },
            select: [
                'id',
                'firstName',
                'lastName',
                'email',
                'password',
                'role',
            ],
        });
    }

    async getAll(role?: string): Promise<User[]> {
        const where: FindOptionsWhere<User> | undefined = role
            ? { role }
            : undefined;
        return await this.userRepository.find({
            where,
            relations: ['tenant'],
        });
    }

    async findById(id: number) {
        return await this.userRepository.findOne({
            where: { id },
            relations: ['tenant'],
        });
    }

    async deleteById(id: number) {
        return await this.userRepository.softDelete({ id });
    }

    async updateById(id: number, data: UserUpadateData) {
        const managerUpdate = await this.userRepository.findOne({
            where: { id },
            relations: ['tenant'],
        });

        if (!managerUpdate) {
            throw new Error(`User with ID ${id} not found`);
        }

        managerUpdate.firstName = data.firstName;
        managerUpdate.lastName = data.lastName;
        managerUpdate.email = data.email;
        managerUpdate.role = data.role;
        managerUpdate.tenant = { id: data.tenantId } as Tenant;

        await this.userRepository.save(managerUpdate);
        return managerUpdate;
    }
}
