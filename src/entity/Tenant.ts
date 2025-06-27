import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    UpdateDateColumn,
    CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'tenants' })
export class Tenant {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    name: string;

    @Column({ length: 255 })
    address: string;

    @UpdateDateColumn()
    updateAt: number;

    @CreateDateColumn()
    createdAt: number;
}
