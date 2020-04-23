import { Entity, Column, OneToOne, CreateDateColumn, PrimaryColumn, OneToMany } from 'typeorm';
import { Log } from 'src/log/log.entity';
import { v4 } from 'uuid';

@Entity()
export class User {
    @PrimaryColumn({ name: 'id' })
    id: string = v4();
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
    @Column({ name: 'username' })
    username: string;

    @Column({ name: 'password' })
    password: string;

    // 声明子类映射，及在子类中对应的 field
    @OneToMany(type => Log, log => log.userId)
    log: Log[];
}
