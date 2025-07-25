import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    UpdateDateColumn,
    CreateDateColumn,
    Unique,
    DeleteDateColumn,
} from 'typeorm';

@Entity({ name: 'tenants' })
@Unique('UQ_tenant_name_address', ['name', 'address']) // 👈 named composite unique key
export class Tenant {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    name: string;

    @Column({ length: 255 })
    address: string;

    @UpdateDateColumn()
    updateAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
