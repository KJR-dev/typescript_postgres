import { Repository } from 'typeorm';
import { Tenant } from '../entity/Tenant';
import { ITenant } from '../types/tenantType';

export class TenantService {
    constructor(private tenantRepository: Repository<Tenant>) {}

    async create(tenantData: ITenant) {
        return await this.tenantRepository.save(tenantData);
    }

    async getAll() {
        return await this.tenantRepository.find();
    }

    async getById(id: number) {
        return await this.tenantRepository.findOneBy({ id });
    }

    async deleteById(id: number) {
        return await this.tenantRepository.softDelete({ id });
    }

    async updateById(id: number, name: string, address: string) {
        return await this.tenantRepository.update({ id }, { name, address });
    }
}
