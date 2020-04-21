import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from 'src/user/user.entity';

@Entity()
export class Log {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    commentedAt?: number = new Date().getTime();

    @Column()
    content: string;

    // 声明父类映射，及在子父类中对应的 field
    @OneToOne(type => User, user => user.log)
    @JoinColumn()
    userId: string;
}
