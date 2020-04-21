import { Entity, PrimaryGeneratedColumn, Column, OneToOne, CreateDateColumn } from 'typeorm';
import { Log } from 'src/log/log.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id?: number;
    @CreateDateColumn()
    createdAt: Date;
    @Column()
    username: string;

    @Column()
    password: string;

    // 声明子类映射，及在子类中对应的 field
    @OneToOne(type => Log, log => log.userId)
    log?: Log;
}
