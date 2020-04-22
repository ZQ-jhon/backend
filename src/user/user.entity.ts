import { Entity, Column, OneToOne, CreateDateColumn, PrimaryColumn } from 'typeorm';
import { Log } from 'src/log/log.entity';
import { v4 } from 'uuid';

@Entity()
export class User {
    @PrimaryColumn()
    id?: string = v4();
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
